import type { RouteRecordName, Router } from 'vue-router';
import { preloadRoute } from './routeLazy';
import type { iRouteLazyMeta } from './routeLazy.type';

function preloadNextRoute(name: RouteRecordName) {
  preloadRoute(name).catch((error) => {
    console.error(`Failed to preload route "${String(name)}":`, error);
  });
}

export function setupRouteLazyRunner(router: Router) {
  router.afterEach((to, _from, failure) => {
    if (failure) {
      return;
    }

    const lazyMeta = to.meta.lazy as iRouteLazyMeta | undefined;

    if (!lazyMeta?.preload?.length) {
      return;
    }

    lazyMeta.preload.forEach(preloadNextRoute);
  });
}
