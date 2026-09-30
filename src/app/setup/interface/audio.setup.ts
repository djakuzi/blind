import { watch } from 'vue';
import type { Pinia } from 'pinia';
import { useStaticLocale } from '@/app/features/locale/composables/useStaticLocale';
import { useLoaderStore } from '@/app/stores/loader/loader.store';
import { useSettingsStore } from '@/app/stores/settings/settings.store';
import { retryPostMountSetup } from '@/core/app/setup/setup.runner';
import type { iSetup } from '@/core/app/setup/setup.type';
import { MediaAudio } from '@/core/media/audio';
import { ToolAudio } from '@/core/tool/audio';

const APP_SETUP_AUDIO_SCOPE_KEY = 'app-setup-audio';
const APP_SETUP_AUDIO_RESOURCE_KEY = 'audio';

export function createAudioSetup(pinia: Pinia): iSetup {
  const loaderStore = useLoaderStore(pinia);
  const settingsStore = useSettingsStore(pinia);
  const staticLocale = useStaticLocale(['loading'], pinia);

  const resourcePayload = {
    scopeKey: APP_SETUP_AUDIO_SCOPE_KEY,
    resourceKey: APP_SETUP_AUDIO_RESOURCE_KEY,
  };

  async function loadAudio() {
    loaderStore.setResourcePending(resourcePayload);

    try {
      await ToolAudio.preload([
        ...MediaAudio.getAudioGroup('sfx.interaction'),
      ]);

      loaderStore.setResourceLoaded(resourcePayload);
    } catch (error) {
      loaderStore.setResourceError({
        ...resourcePayload,
        error: {
          title: staticLocale.value.loading.audioError,
          actions: [
            {
              title: staticLocale.value.loading.retry,
              callback: () => retryPostMountSetup('audio'),
            },
          ],
        },
      });

      throw error;
    }
  }

  return {
    key: 'audio',

    async preMount() {
      await ToolAudio.setMuted(!settingsStore.soundEnabled);

      loaderStore.registerScope({
        scopeKey: APP_SETUP_AUDIO_SCOPE_KEY,
        title: staticLocale.value.loading.audio,
        progressMode: 'determinate',
        resources: {
          [APP_SETUP_AUDIO_RESOURCE_KEY]: 'pending',
        },
      });

      watch(
        () => settingsStore.soundEnabled,
        async (soundEnabled) => {
          await ToolAudio.setMuted(!soundEnabled);
        },
      );
    },

    postMount: {
      mode: 'blocking',
      run: loadAudio,
    },
  };
}
