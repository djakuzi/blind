import type { Pinia } from 'pinia';
import { useStaticLocale } from '@/app/features/locale/composables/useStaticLocale';
import { useGameStore } from '@/app/stores/game/game.store';
import { useLoaderStore } from '@/app/stores/loader/loader.store';
import { retryPostMountSetup } from '@/core/app/setup/lifecycle/setupLifecycle.runner';
import type { iSetup } from '@/core/app/setup/lifecycle/setupLifecycle.type';

const APP_SETUP_GAME_MODES_SCOPE_KEY = 'app-setup-game-modes';
const APP_SETUP_GAME_MODES_RESOURCE_KEY = 'game-modes';

export function createGameModesSetup(pinia: Pinia): iSetup {
  const gameStore = useGameStore(pinia);
  const loaderStore = useLoaderStore(pinia);
  const staticLocale = useStaticLocale(['loading'], pinia);

  const resourcePayload = {
    scopeKey: APP_SETUP_GAME_MODES_SCOPE_KEY,
    resourceKey: APP_SETUP_GAME_MODES_RESOURCE_KEY,
  };

  async function loadGameModes() {
    loaderStore.setResourcePending(resourcePayload);

    try {
      await gameStore.loadGameModes();

      loaderStore.setResourceLoaded(resourcePayload);
    } catch (error) {
      loaderStore.setResourceError({
        ...resourcePayload,
        error: {
          title: staticLocale.value.loading.gameModesError,
          actions: [
            {
              title: staticLocale.value.loading.retry,
              callback: () => retryPostMountSetup('gameModes'),
            },
          ],
        },
      });

      throw error;
    }
  }

  return {
    key: 'gameModes',

    preMount() {
      loaderStore.registerScope({
        scopeKey: APP_SETUP_GAME_MODES_SCOPE_KEY,
        title: staticLocale.value.loading.gameModes,
        progressMode: 'determinate',
        resources: {
          [APP_SETUP_GAME_MODES_RESOURCE_KEY]: 'pending',
        },
      });
    },

    postMount: {
      mode: 'blocking',
      run: loadGameModes,
    },
  };
}
