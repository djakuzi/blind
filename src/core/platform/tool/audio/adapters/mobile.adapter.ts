import { NativeAudio } from '@capgo/capacitor-native-audio';
import type {
  iAudioAdapter,
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioSubscription,
} from '../type';

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

function createPlayOptions(
  assetId: string,
  options: iAudioPlayOptions,
) {
  return {
    assetId,
    ...(options.volume === undefined
      ? {}
      : {
          volume: normalizeVolume(options.volume),
        }),
    ...(options.time === undefined
      ? {}
      : {
          time: normalizeTime(options.time),
        }),
    ...(options.delay === undefined
      ? {}
      : {
          delay: normalizeTime(options.delay),
        }),
  };
}

export const MobileAudioAdapter: iAudioAdapter = {
  async activate() {
    return {
      isHandled: true,
    };
  },

  async preloadResource(audio: iAudioPreloadResource) {
    const options = {
      assetId: audio.id,
      assetPath: audio.src,
      audioChannelNum: normalizeChannels(audio.channels),
      volume: normalizeVolume(audio.volume),
      isUrl: false,
    };

    const { found } = await NativeAudio.isPreloaded(options);

    if (!found) {
      await NativeAudio.preload(options);
    }
  },

  async playResource(audio, options) {
    await NativeAudio.play(createPlayOptions(audio.id, options));
  },

  async startLoop(audio) {
    await NativeAudio.loop({
      assetId: audio.id,
    });
  },

  async stopResource(assetId) {
    await NativeAudio.stop({
      assetId,
    });
  },

  async subscribeComplete(callback): Promise<iAudioSubscription> {
    const listener = await NativeAudio.addListener(
      'complete',
      ({ assetId }) => {
        callback(assetId);
      },
    );

    return {
      async unsubscribe() {
        await listener.remove();
      },
    };
  },

  async destroy() {
    await NativeAudio.deinitPlugin();
  },
};
