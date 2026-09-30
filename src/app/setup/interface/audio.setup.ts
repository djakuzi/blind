import { watch } from 'vue';
import type { Pinia } from 'pinia';
import { useSettingsStore } from '@/app/stores/settings/settings.store';
import type { iSetup } from '@/core/app/setup/setup.type';
import { AUDIO_ASSETS } from '@/core/media/audio';
import { ToolAudio } from '@/core/tool/audio';

export function createAudioSetup(pinia: Pinia): iSetup {
  const settingsStore = useSettingsStore(pinia);

  return {
    key: 'audio',

    async preMount() {
      await Promise.all(Object.values(AUDIO_ASSETS).map((audio) => ToolAudio.preload(audio)));
      await ToolAudio.setMuted(!settingsStore.soundEnabled);

      watch(
        () => settingsStore.soundEnabled,
        async (soundEnabled) => {
          await ToolAudio.setMuted(!soundEnabled);
        },
      );
    },
  };
}
