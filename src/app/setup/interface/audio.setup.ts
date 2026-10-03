import { watch } from 'vue';
import type { Pinia } from 'pinia';
import { useStaticLocale } from '@/app/features/locale/composables/useStaticLocale';
import { useLoaderStore } from '@/app/stores/loader/loader.store';
import { useSettingsStore } from '@/app/stores/settings/settings.store';
import { retryPostMountSetup } from '@/core/app/setup/setup.runner';
import type { iSetup } from '@/core/app/setup/setup.type';
import { MediaAudio } from '@/core/media/audio';
import { ToolAudio } from '@/core/platform';

const APP_SETUP_AUDIO_SCOPE_KEY = 'app-setup-audio';
const APP_SETUP_AUDIO_RESOURCE_KEY = 'audio';

export function createAudioSetup(pinia: Pinia): iSetup {
  const loaderStore = useLoaderStore(pinia);
  const settingsStore = useSettingsStore(pinia);
  const staticLocale = useStaticLocale(['loading'], pinia);

  let removeAudioActivationListeners: (() => void) | undefined;

  const resourcePayload = {
    scopeKey: APP_SETUP_AUDIO_SCOPE_KEY,
    resourceKey: APP_SETUP_AUDIO_RESOURCE_KEY,
  };

  function setupAudioActivation() {
    if (typeof window === 'undefined' || removeAudioActivationListeners) {
      return;
    }

    let isActivating = false;

    function removeListeners() {
      window.removeEventListener('pointerdown', handleActivation, true);
      window.removeEventListener('touchstart', handleActivation, true);
      window.removeEventListener('keydown', handleActivation, true);
      removeAudioActivationListeners = undefined;
    }

    function handleActivation() {
      if (isActivating) {
        return;
      }

      isActivating = true;

      ToolAudio.activate()
        .then(({ isHandled }) => {
          if (isHandled) {
            removeListeners();
          }
        })
        .catch(() => {
          return;
        })
        .finally(() => {
          isActivating = false;
        });
    }

    window.addEventListener('pointerdown', handleActivation, true);
    window.addEventListener('touchstart', handleActivation, {
      capture: true,
      passive: true,
    });
    window.addEventListener('keydown', handleActivation, true);

    removeAudioActivationListeners = removeListeners;
  }

  async function loadAudio() {
    loaderStore.setResourcePending(resourcePayload);

    try {
      await ToolAudio.preload(MediaAudio.getAudioGroup('sfx'));

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
      setupAudioActivation();

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
