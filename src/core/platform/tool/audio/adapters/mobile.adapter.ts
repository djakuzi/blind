import { NativeAudio } from '@capgo/capacitor-native-audio';
import { HelperAudio } from '../helpers/audio.helper';
import type {
  iAudioAdapter,
  iAudioLoopOptions,
  iAudioLoopVolumeOptions,
  iAudioPlayOptions,
  iAudioPreloadResource,
} from '../type';

interface iMobileAudioPool {
  audio: iAudioPreloadResource;
  playAssetIds: string[];
  loopAssetId: string;
  nextPlayIndex: number;
  isLoopPreloaded: boolean;
  loopPreloadRequest?: Promise<void>;
}

const audioPools = new Map<string, iMobileAudioPool>();
const nativeAssetOwners = new Map<string, string>();

let isConfigured = false;
let configureRequest: Promise<void> | undefined;

function createPlayAssetId(assetId: string, index: number) {
  return `${assetId}::play-${index}`;
}

function createLoopAssetId(assetId: string) {
  return `${assetId}::loop`;
}

async function ensureConfigured() {
  if (isConfigured) {
    return;
  }

  if (configureRequest) {
    await configureRequest;
    return;
  }

  const request = NativeAudio.configure({
    focus: false,
    background: false,
    ignoreSilent: true,
    showNotification: false,
  }).then(() => {
    isConfigured = true;
  });

  configureRequest = request;

  try {
    await request;
  } finally {
    if (configureRequest === request) {
      configureRequest = undefined;
    }
  }
}

function createPlayOptions(
  assetId: string,
  options: iAudioPlayOptions,
  defaultVolume?: number,
) {
  const volume = options.volume ?? defaultVolume;

  return {
    assetId,
    ...(volume === undefined
      ? {}
      : {
          volume: HelperAudio.normalizeNativeVolume(volume),
        }),
    ...(options.time === undefined
      ? {}
      : {
          time: HelperAudio.normalizeTime(options.time),
        }),
    ...(options.delay === undefined
      ? {}
      : {
          delay: HelperAudio.normalizeTime(options.delay),
        }),
  };
}

async function preloadNativeAsset(
  assetId: string,
  ownerId: string,
  audio: iAudioPreloadResource,
  trackCompletion = true,
) {
  const options = {
    assetId,
    assetPath: audio.src,
    audioChannelNum: 1,
    volume: HelperAudio.normalizeNativeVolume(audio.volume),
    isUrl: false,
  };

  const { found } = await NativeAudio.isPreloaded(options);

  if (!found) {
    await NativeAudio.preload(options);
  }

  if (trackCompletion) {
    nativeAssetOwners.set(assetId, ownerId);
  }
}

function getAudioPool(assetId: string) {
  const pool = audioPools.get(assetId);

  if (!pool) {
    throw new Error(`Audio resource is not preloaded: ${assetId}`);
  }

  return pool;
}

async function ensureLoopPreloaded(pool: iMobileAudioPool) {
  if (pool.isLoopPreloaded) {
    return;
  }

  if (pool.loopPreloadRequest) {
    await pool.loopPreloadRequest;
    return;
  }

  const request = preloadNativeAsset(
    pool.loopAssetId,
    pool.audio.id,
    pool.audio,
    false,
  ).then(() => {
    pool.isLoopPreloaded = true;
  });

  pool.loopPreloadRequest = request;

  try {
    await request;
  } finally {
    if (pool.loopPreloadRequest === request) {
      pool.loopPreloadRequest = undefined;
    }
  }
}

export const MobileAudioAdapter: iAudioAdapter = {
  async activate() {
    await ensureConfigured();

    return {
      isHandled: true,
    };
  },

  async preloadResource(audio: iAudioPreloadResource) {
    await ensureConfigured();

    const channels = HelperAudio.normalizeChannels(audio.channels);
    const playAssetIds = Array.from(
      { length: channels },
      (_, index) => createPlayAssetId(audio.id, index),
    );

    await Promise.all(
      playAssetIds.map((assetId) =>
        preloadNativeAsset(assetId, audio.id, audio),
      ),
    );

    audioPools.set(audio.id, {
      audio,
      playAssetIds,
      loopAssetId: createLoopAssetId(audio.id),
      nextPlayIndex: 0,
      isLoopPreloaded: false,
    });
  },

  async playResource(audio, options) {
    const pool = getAudioPool(audio.id);
    const assetId = pool.playAssetIds[pool.nextPlayIndex];

    pool.nextPlayIndex = (pool.nextPlayIndex + 1) % pool.playAssetIds.length;

    await NativeAudio.play(
      createPlayOptions(assetId, options, pool.audio.volume),
    );
  },

  async startLoop(audio, options: iAudioLoopOptions) {
    const pool = getAudioPool(audio.id);

    await ensureLoopPreloaded(pool);

    if (options.volume !== undefined) {
      await NativeAudio.setVolume({
        assetId: pool.loopAssetId,
        volume: HelperAudio.normalizeNativeVolume(options.volume),
      });
    }

    await NativeAudio.loop({
      assetId: pool.loopAssetId,
    });
  },

  async setLoopVolume(
    assetId: string,
    options: iAudioLoopVolumeOptions,
  ) {
    const pool = getAudioPool(assetId);

    if (!pool.isLoopPreloaded) {
      return;
    }

    await NativeAudio.setVolume({
      assetId: pool.loopAssetId,
      volume: HelperAudio.normalizeNativeVolume(options.volume),
      duration: HelperAudio.normalizeTime(options.duration),
    });
  },

  async stopResource(assetId) {
    const pool = audioPools.get(assetId);

    if (!pool) {
      await NativeAudio.stop({
        assetId,
      });
      return;
    }

    const nativeAssetIds = [
      ...pool.playAssetIds,
      ...(pool.isLoopPreloaded ? [pool.loopAssetId] : []),
    ];

    await Promise.all(
      nativeAssetIds.map((nativeAssetId) =>
        NativeAudio.stop({
          assetId: nativeAssetId,
        }),
      ),
    );
  },

  async subscribeComplete(callback) {
    const listener = await NativeAudio.addListener(
      'complete',
      ({ assetId }) => {
        const ownerId = nativeAssetOwners.get(assetId);

        if (ownerId !== undefined) {
          callback(ownerId);
        }
      },
    );

    return {
      async unsubscribe() {
        await listener.remove();
      },
    };
  },

  async destroy() {
    audioPools.clear();
    nativeAssetOwners.clear();
    configureRequest = undefined;
    isConfigured = false;

    await NativeAudio.deinitPlugin();
  },
};
