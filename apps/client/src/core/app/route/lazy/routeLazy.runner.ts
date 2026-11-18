import type { RouteRecordName, Router } from 'vue-router';
import { LibScheduler } from '@/core/lib/scheduler';
import { preloadRoute } from './routeLazy';
import type { iRouteLazyMeta } from './routeLazy.type';

const ROUTE_PRELOAD_START_DELAY_MS = 260;

function preloadNextRoute(name: RouteRecordName) {
  return preloadRoute(name).catch((error) => {
    console.error(`Failed to preload route "${String(name)}":`, error);
  });
}

export function setupRouteLazyRunner(router: Router) {
  let preloadSession = 0;

  router.afterEach((to, _from, failure) => {
    if (failure) {
      return;
    }

    const lazyMeta = to.meta.lazy as iRouteLazyMeta | undefined;
    const preloadRoutes = lazyMeta?.preload ?? [];
    const currentSession = ++preloadSession;

    if (preloadRoutes.length === 0) {
      return;
    }

    async function runPreloadQueue() {
      for (let index = 0; index < preloadRoutes.length; index++) {
        await LibScheduler.waitForIdle({
          delay: index === 0 ? ROUTE_PRELOAD_START_DELAY_MS : 0,
        });

        if (currentSession !== preloadSession) {
          return;
        }

        const routeName = preloadRoutes[index];

        if (routeName === undefined) {
          continue;
        }

        await preloadNextRoute(routeName);
      }
    }

    runPreloadQueue().catch((error) => {
      console.error('Failed to run route preload queue:', error);
    });
  });
}
