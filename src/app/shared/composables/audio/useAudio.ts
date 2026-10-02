import { onUnmounted, shallowReactive } from 'vue';
import { MediaAudio } from '@/core/media/audio';
import type { tAudioId } from '@/core/media/audio';
import type { iAudioPlayOptions, iAudioResource } from '@/core/platform/tool/audio';
import { ToolAudio } from '@/core/platform/tool/audio';

type tAudioInput = tAudioId | readonly tAudioId[];

export function useAudio() {
  const loops = shallowReactive(new Map<tAudioId, iAudioResource>());

  function play(id: tAudioId, options: iAudioPlayOptions = {}) {
    const audio = MediaAudio.getAudio(id);

    ToolAudio.play(audio, options).catch((error) => {
      console.error(`Failed to play audio "${id}":`, error);
    });
  }

  async function loop(input: tAudioInput) {
    const ids = Array.isArray(input) ? input : [input];

    await Promise.all(
      ids.map(async (id) => {
        if (loops.has(id)) {
          return;
        }

        const audio = MediaAudio.getAudio(id);

        loops.set(id, audio);
        await ToolAudio.loop(audio);
      }),
    );
  }

  async function stop(input: tAudioInput) {
    const ids = Array.isArray(input) ? input : [input];

    await Promise.all(
      ids.map(async (id) => {
        const audio = loops.get(id) ?? MediaAudio.getAudio(id);

        loops.delete(id);
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
