import { NativeAudio } from '@capgo/capacitor-native-audio';
import { HelperAudio } from '../helpers/audio.helper';
import type {
  iAudioAdapter,
  iAudioPlayOptions,
  iAudioPreloadResource,
} from '../type';

function createPlayOptions(
  assetId: string,
  options: iAudioPlayOptions,
) {
  return {
    assetId,
    ...(options.volume === undefined
      ? {}
      : {
          volume: HelperAudio.normalizeNativeVolume(options.volume),
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
      audioChannelNum: HelperAudio.normalizeChannels(audio.channels),
      volume: HelperAudio.normalizeNativeVolume(audio.volume),
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

  async subscribeComplete(callback) {
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
