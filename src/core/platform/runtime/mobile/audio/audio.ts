import { NativeAudio } from '@capgo/capacitor-native-audio';
import type {
  iAudioAdapter,
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioResource,
} from '../../../tool/audio/type';

interface iPluginListenerHandle {
  remove(): Promise<void>;
}

let muted = false;
let completeListener: iPluginListenerHandle | undefined;
let completeListenerRequest: Promise<void> | undefined;

const activePlayCounts = new Map<string, number>();
const activeLoops = new Map<string, iAudioResource>();
const runningLoopIds = new Set<string>();
const preloadedAudioIds = new Set<string>();
const preloadRequests = new Map<string, Promise<void>>();
const loopRequests = new Map<string, Promise<void>>();

function handled() {
  return { isHandled: true };
}

function normalizeChannels(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function normalizeVolume(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return 1;
  }

  return Math.min(1, Math.max(0.1, value));
}

function normalizeTime(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

function decrementActivePlay(assetId: string) {
  const count = activePlayCounts.get(assetId);

  if (!count) {
    return;
  }

  if (count <= 1) {
    activePlayCounts.delete(assetId);
    return;
  }

  activePlayCounts.set(assetId, count - 1);
}

async function ensureCompleteListener() {
  if (completeListener) {
    return;
  }

  if (completeListenerRequest) {
    await completeListenerRequest;
    return;
  }

  const request = (async () => {
    try {
      completeListener = await NativeAudio.addListener('complete', ({ assetId }) => {
        decrementActivePlay(assetId);
      });
    } catch {
      return;
    }
  })();

  completeListenerRequest = request;

  try {
    await request;
  } finally {
    if (completeListenerRequest === request) {
      completeListenerRequest = undefined;
    }
  }
}

async function preloadResource(audio: iAudioPreloadResource) {
  if (preloadedAudioIds.has(audio.id)) {
    return;
  }

  const activeRequest = preloadRequests.get(audio.id);

  if (activeRequest) {
    await activeRequest;
    return;
  }

  const options = {
    assetId: audio.id,
    assetPath: audio.src,
    audioChannelNum: normalizeChannels(audio.channels),
    volume: normalizeVolume(audio.volume),
    isUrl: false,
  };

  const request = (async () => {
    const { found } = await NativeAudio.isPreloaded(options);

    if (!found) {
      await NativeAudio.preload(options);
    }

    preloadedAudioIds.add(audio.id);
  })();

  preloadRequests.set(audio.id, request);

  try {
    await request;
  } finally {
    if (preloadRequests.get(audio.id) === request) {
      preloadRequests.delete(audio.id);
    }
  }
}

function createPlayOptions(audio: iAudioResource, options: iAudioPlayOptions) {
  return {
    assetId: audio.id,
    ...(options.volume === undefined ? {} : { volume: normalizeVolume(options.volume) }),
    ...(options.time === undefined ? {} : { time: normalizeTime(options.time) }),
    ...(options.delay === undefined ? {} : { delay: normalizeTime(options.delay) }),
  };
}

async function startLoop(audio: iAudioResource) {
  if (muted || !activeLoops.has(audio.id) || runningLoopIds.has(audio.id)) {
    return;
  }

  const activeRequest = loopRequests.get(audio.id);

  if (activeRequest) {
    await activeRequest;
    return;
  }

  const request = (async () => {
    if (muted || !activeLoops.has(audio.id) || runningLoopIds.has(audio.id)) {
      return;
    }

    await NativeAudio.loop({ assetId: audio.id });

    if (muted || !activeLoops.has(audio.id)) {
      await NativeAudio.stop({ assetId: audio.id });
      return;
    }

    runningLoopIds.add(audio.id);
  })();

  loopRequests.set(audio.id, request);

  try {
    await request;
  } finally {
    if (loopRequests.get(audio.id) === request) {
      loopRequests.delete(audio.id);
    }
  }
}

export const RuntimeMobileAudio: iAudioAdapter = {
  async activate() {
    await ensureCompleteListener();
    return handled();
  },

  async preload(resources) {
    await Promise.all(resources.map((audio) => preloadResource(audio)));
    return handled();
  },

  async play(audio, options) {
    if (muted) {
      return handled();
    }

    await ensureCompleteListener();
    await NativeAudio.play(createPlayOptions(audio, options));

    if (muted) {
      await NativeAudio.stop({ assetId: audio.id });
      return handled();
    }

    activePlayCounts.set(audio.id, (activePlayCounts.get(audio.id) ?? 0) + 1);
    return handled();
  },

  async loop(audio) {
    activeLoops.set(audio.id, audio);
    await startLoop(audio);
    return handled();
  },

  async stop(audio) {
    activePlayCounts.delete(audio.id);
    activeLoops.delete(audio.id);

    const activeLoopRequest = loopRequests.get(audio.id);

    if (activeLoopRequest) {
      await activeLoopRequest;
    }

    runningLoopIds.delete(audio.id);
    await NativeAudio.stop({ assetId: audio.id });

    return handled();
  },

  async setMuted(value) {
    if (muted === value) {
      return handled();
    }

    muted = value;

    if (muted) {
      await Promise.allSettled([...loopRequests.values()]);

      const audioIds = new Set([
        ...activePlayCounts.keys(),
        ...runningLoopIds,
      ]);

      await Promise.all(
        [...audioIds].map((assetId) => NativeAudio.stop({ assetId })),
      );

      activePlayCounts.clear();
      runningLoopIds.clear();

      return handled();
    }

    await Promise.all([...activeLoops.values()].map((audio) => startLoop(audio)));
    return handled();
  },

  async destroy() {
    activeLoops.clear();

    await Promise.allSettled([
      ...preloadRequests.values(),
      ...loopRequests.values(),
      ...(completeListenerRequest ? [completeListenerRequest] : []),
    ]);

    const listener = completeListener;
    completeListener = undefined;

    if (listener) {
      await listener.remove();
    }

    activePlayCounts.clear();
    runningLoopIds.clear();
    preloadedAudioIds.clear();
    preloadRequests.clear();
    loopRequests.clear();
    muted = false;

    await NativeAudio.deinitPlugin();
    return handled();
  },
};
