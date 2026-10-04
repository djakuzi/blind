import type { RouteRecordName } from 'vue-router';
import { getRouteLazy, registerRouteLazy } from './routeLazy.registry';
import type { tRouteLazyLoader } from './routeLazy.type';

export function createLazyRoute<T>(name: RouteRecordName, loader: tRouteLazyLoader<T>): tRouteLazyLoader<T> {
  let loading: Promise<T> | undefined;

  function load() {
    if (!loading) {
      loading = loader().catch((error) => {
        loading = undefined;
        throw error;
      });
    }

    return loading;
  }

  registerRouteLazy(name, {
    async preload() {
      await load();
    },
  });

  return load;
}

export async function preloadRoute(name: RouteRecordName) {
  const route = getRouteLazy(name);

  if (!route) {
    throw new Error(`Lazy route "${String(name)}" is not registered`);
  }

  await route.preload();
}
