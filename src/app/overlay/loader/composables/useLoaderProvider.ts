import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useLoaderStore } from '@/app/stores/loader/loader.store';
import type { iLoaderResourceError } from '@/app/stores/loader/loader.type';

export function useLoaderProvider() {
  const loaderStore = useLoaderStore();
  const { errorResourcesCount, pendingResourcesCount, progress, scopesList, totalResourcesCount } = storeToRefs(loaderStore);

  const isActive = computed(() => {
    return totalResourcesCount.value > 0 && (pendingResourcesCount.value > 0 || errorResourcesCount.value > 0);
  });

  const text = computed(() => {
    const loadingScope = scopesList.value.find((scope) => {
      return Object.values(scope.resources).some((resource) => resource.state === 'pending');
    });

    return loadingScope?.title ?? '';
  });

  const error = computed<iLoaderResourceError | undefined>(() => {
    for (const scope of scopesList.value) {
      const errorResource = Object.values(scope.resources).find((resource) => resource.state === 'error' && resource.error);

      if (errorResource?.error) {
        return errorResource.error;
      }
    }

    return undefined;
  });

  function handleHidden() {
    loaderStore.clearCompletedScopes();
  }

  return {
    error,
    handleHidden,
    isActive,
    progress,
    text,
  };
}
