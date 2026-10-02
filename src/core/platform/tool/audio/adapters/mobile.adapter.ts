import { NativeAudio } from '@capgo/capacitor-native-audio';
import { HelperAudio } from '../helpers/audio.helper';
import type {
  iAudioAdapter,
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioResource,
} from '../type';

let muted = false;

const activeAudioIds = new Set<string>();
const activeLoops = new Map<string, iAudioResource>();
const runningLoopIds = new Set<string>();
const preloadedAudioIds = new Set<string>();
const preloadRequests = new Map<string, Promise<void>>();
const loopRequests = new Map<string, Promise<void>>();

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
    audioChannelNum: HelperAudio.normalizeChannels(audio.channels),
    volume: HelperAudio.normalizeVolume(audio.volume),
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
    ...(options.volume === undefined
      ? {}
      : {
          volume: HelperAudio.normalizeVolume(options.volume),
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

    await NativeAudio.loop({
      assetId: audio.id,
    });

    if (muted || !activeLoops.has(audio.id)) {
      await NativeAudio.stop({
        assetId: audio.id,
      });

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

export const MobileAudioAdapter: iAudioAdapter = {
  async activate() {
    return HelperAudio.createHandledResult();
  },

  async preload(resources) {
    await Promise.all(resources.map((audio) => preloadResource(audio)));

    return HelperAudio.createHandledResult();
  },

  async play(audio, options) {
    if (muted) {
      return HelperAudio.createHandledResult();
    }

    await NativeAudio.play(createPlayOptions(audio, options));

    if (muted) {
      await NativeAudio.stop({
        assetId: audio.id,
      });

      return HelperAudio.createHandledResult();
    }

    activeAudioIds.add(audio.id);

    return HelperAudio.createHandledResult();
  },

  async loop(audio) {
    activeLoops.set(audio.id, audio);

    await startLoop(audio);

    return HelperAudio.createHandledResult();
  },

  async stop(audio) {
    activeAudioIds.delete(audio.id);
    activeLoops.delete(audio.id);

    const activeLoopRequest = loopRequests.get(audio.id);

    if (activeLoopRequest) {
      await activeLoopRequest;
    }

    runningLoopIds.delete(audio.id);

    await NativeAudio.stop({
      assetId: audio.id,
    });

    return HelperAudio.createHandledResult();
  },

  async setMuted(value) {
    if (muted === value) {
      return HelperAudio.createHandledResult();
    }

    muted = value;

    if (muted) {
      await Promise.allSettled([...loopRequests.values()]);

      const audioIds = new Set([...activeAudioIds, ...runningLoopIds]);

      await Promise.all(
        [...audioIds].map((assetId) =>
          NativeAudio.stop({
            assetId,
          }),
        ),
      );

      activeAudioIds.clear();
      runningLoopIds.clear();

      return HelperAudio.createHandledResult();
    }

    await Promise.all([...activeLoops.values()].map((audio) => startLoop(audio)));

    return HelperAudio.createHandledResult();
  },

  async destroy() {
    activeLoops.clear();

    await Promise.allSettled([
      ...preloadRequests.values(),
      ...loopRequests.values(),
    ]);

    activeAudioIds.clear();
    runningLoopIds.clear();
    preloadedAudioIds.clear();
    preloadRequests.clear();
    loopRequests.clear();
    muted = false;

    await NativeAudio.deinitPlugin();

    return HelperAudio.createHandledResult();
  },
};
