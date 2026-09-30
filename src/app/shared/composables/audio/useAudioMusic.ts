import { onUnmounted, shallowRef } from 'vue';
import type { iAudioResource } from '@/core/tool/audio';
import { ToolAudio } from '@/core/tool/audio';

export function useAudioMusic() {
  const audio = shallowRef<iAudioResource | null>(null);

  async function setAudio(nextAudio: iAudioResource | null) {
    if (audio.value?.id === nextAudio?.id) {
      return;
    }

    if (audio.value) {
      await ToolAudio.stop(audio.value);
    }

    audio.value = nextAudio;

    if (audio.value) {
      await ToolAudio.loop(audio.value);
    }
  }

  async function removeAudio() {
    await setAudio(null);
  }

  onUnmounted(removeAudio);

  return {
    audio,
    setAudio,
    removeAudio,
  };
}
