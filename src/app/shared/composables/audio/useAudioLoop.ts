import { onUnmounted, shallowReactive } from 'vue';
import type { iAudioResource } from '@/core/tool/audio';
import { ToolAudio } from '@/core/tool/audio';

type tAudioInput = iAudioResource | iAudioResource[];

export function useAudioLoop() {
  const audios = shallowReactive(new Map<string, iAudioResource>());

  async function addAudio(input: tAudioInput) {
    const resources = Array.isArray(input) ? input : [input];

    await Promise.all(
      resources.map(async (audio) => {
        if (audios.has(audio.id)) {
          return;
        }

        audios.set(audio.id, audio);
        await ToolAudio.loop(audio);
      }),
    );
  }

  async function removeAudio(input: tAudioInput) {
    const resources = Array.isArray(input) ? input : [input];

    await Promise.all(
      resources.map(async (audio) => {
        if (!audios.delete(audio.id)) {
          return;
        }

        await ToolAudio.stop(audio);
      }),
    );
  }

  async function clearAudio() {
    const resources = [...audios.values()];

    audios.clear();

    await Promise.all(resources.map((audio) => ToolAudio.stop(audio)));
  }

  onUnmounted(clearAudio);

  return {
    audios,
    addAudio,
    removeAudio,
    clearAudio,
  };
}
