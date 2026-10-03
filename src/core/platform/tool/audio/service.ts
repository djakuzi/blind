import type {
  iAudioAdapter,
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioResource,
} from './type';

export function createAudioService(adapter: iAudioAdapter) {
  function preload(
    input: iAudioPreloadResource | readonly iAudioPreloadResource[],
  ) {
    const resources = Array.isArray(input) ? input : [input];

    return adapter.preload(resources);
  }

  function play(
    audio: iAudioResource,
    options: iAudioPlayOptions = {},
  ) {
    return adapter.play(audio, options);
  }

  return {
    activate: adapter.activate,
    preload,
    play,
    loop: adapter.loop,
    stop: adapter.stop,
    setMuted: adapter.setMuted,
    destroy: adapter.destroy,
  };
}
