import { onUnmounted, shallowReactive } from 'vue';
import type { iAudioPlayOptions, iAudioResource } from '@/core/tool/audio';
import { ToolAudio } from '@/core/tool/audio';

type tAudioInput = iAudioResource | iAudioResource[];

export function useAudio() {
  const loops = shallowReactive(new Map<string, iAudioResource>());

  async function play(audio: iAudioResource, options: iAudioPlayOptions = {}) {
    await ToolAudio.play(audio, options);
  }

  async function loop(input: tAudioInput) {
    const resources = Array.isArray(input) ? input : [input];

    await Promise.all(
      resources.map(async (audio) => {
        if (loops.has(audio.id)) {
          return;
        }

        loops.set(audio.id, audio);
        await ToolAudio.loop(audio);
      }),
    );
  }

  async function stop(input: tAudioInput) {
    const resources = Array.isArray(input) ? input : [input];

    await Promise.all(
      resources.map(async (audio) => {
        loops.delete(audio.id);
        await ToolAudio.stop(audio);
      }),
    );
  }

  async function clear() {
    const resources = [...loops.values()];

    loops.clear();

    await Promise.all(resources.map((audio) => ToolAudio.stop(audio)));
  }

  onUnmounted(clear);

  return {
    loops,
    play,
    loop,
    stop,
    clear,
  };
}
