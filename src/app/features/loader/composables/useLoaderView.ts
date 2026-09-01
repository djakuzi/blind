import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useLoaderStore } from '@/app/stores/loader/loader.store';

export function useLoaderView() {
  const loaderStore = useLoaderStore();
  const {
    errors,
    loadedResourcesCount,
    pendingResourcesCount,
    progress,
    scopesList,
    totalResourcesCount,
  } = storeToRefs(loaderStore);

  const isShow = computed(() => {
    return totalResourcesCount.value > 0 && pendingResourcesCount.value > 0;
  });

  const text = computed(() => {
    const loadingScope = scopesList.value.find((scope) => !scope.isLoaded);

    return loadingScope?.title ?? 'Загрузка';
  });

  return {
    errors,
    isShow,
    loadedResourcesCount,
    pendingResourcesCount,
    progress,
    scopesList,
    text,
    totalResourcesCount,
  };
}
