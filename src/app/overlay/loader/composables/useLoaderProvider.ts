import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useLoaderStore } from '@/app/stores/loader/loader.store';

export function useLoaderProvider() {
  const loaderStore = useLoaderStore();
  const { errorResourcesCount, pendingResourcesCount, progress, scopesList, totalResourcesCount } = storeToRefs(loaderStore);

  const isLoading = computed(() => {
    return totalResourcesCount.value > 0 && (pendingResourcesCount.value > 0 || errorResourcesCount.value > 0);
  });

  const text = computed(() => {
    const loadingScope = scopesList.value.find((scope) => {
      return Object.values(scope.resources).some((resource) => resource.state !== 'loaded');
    });

    return loadingScope?.title ?? '';
  });

  function handleHidden() {
    loaderStore.clearCompletedScopes();
  }

  return {
    handleHidden,
    isLoading,
    progress,
    text,
  };
}
