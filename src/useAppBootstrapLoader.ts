import { nextTick, onMounted } from 'vue';

import { useLoaderRegistry } from '@/app/features/loader/composables/useLoaderRegistry';

const APP_BOOTSTRAP_SCOPE_KEY = 'app-bootstrap';
const APP_BOOTSTRAP_MIN_DISPLAY_TIME = 700;
const APP_BOOTSTRAP_RESOURCES = {
  rootMounted: 'rootMounted',
  firstRenderFrame: 'firstRenderFrame',
  minimumDisplayTime: 'minimumDisplayTime',
} as const;

type tAppBootstrapResourceKey = (typeof APP_BOOTSTRAP_RESOURCES)[keyof typeof APP_BOOTSTRAP_RESOURCES];

export function useAppBootstrapLoader() {
  const loaderRegistry = useLoaderRegistry();

  loaderRegistry.registerScope({
    scopeKey: APP_BOOTSTRAP_SCOPE_KEY,
    title: 'Загрузка',
    resources: {
      [APP_BOOTSTRAP_RESOURCES.rootMounted]: false,
      [APP_BOOTSTRAP_RESOURCES.firstRenderFrame]: false,
      [APP_BOOTSTRAP_RESOURCES.minimumDisplayTime]: false,
    },
  });

  function setBootstrapResourceLoaded(resourceKey: tAppBootstrapResourceKey) {
    loaderRegistry.setResourceState({
      scopeKey: APP_BOOTSTRAP_SCOPE_KEY,
      resourceKey,
      isLoaded: false,
    });
  }

  function waitBootstrapMinDisplayTime() {
    window.setTimeout(() => {
      setBootstrapResourceLoaded(APP_BOOTSTRAP_RESOURCES.minimumDisplayTime);
    }, APP_BOOTSTRAP_MIN_DISPLAY_TIME);
  }

  onMounted(async () => {
    waitBootstrapMinDisplayTime();
    setBootstrapResourceLoaded(APP_BOOTSTRAP_RESOURCES.rootMounted);

    await nextTick();

    requestAnimationFrame(() => {
      setBootstrapResourceLoaded(APP_BOOTSTRAP_RESOURCES.firstRenderFrame);
    });
  });
}
