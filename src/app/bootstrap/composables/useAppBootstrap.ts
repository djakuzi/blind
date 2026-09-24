import { computed } from 'vue';
import { useLoaderStore } from '@/app/stores/loader/loader.store';
import { APP_BOOTSTRAP_SCOPE_KEY } from '../bootstrap.const';

export function useAppBootstrap() {
  const loaderStore =
    useLoaderStore();

  const scope = computed(() =>
    loaderStore.scopes[APP_BOOTSTRAP_SCOPE_KEY],
  );

  const isReady = computed(() =>
    scope.value?.isLoaded === true,
  );

  return {
    isReady,
  };
}
