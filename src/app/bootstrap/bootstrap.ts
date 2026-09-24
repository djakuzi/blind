import type { Pinia } from 'pinia';
import { useAppLanguage } from '@/app/features/locale/composables/useAppLanguage';
import { useStaticLocale } from '@/app/features/locale/composables/useStaticLocale';
import { useLoaderStore } from '@/app/stores/loader/loader.store';
import { APP_BOOTSTRAP_RESOURCES, APP_BOOTSTRAP_SCOPE_KEY } from './bootstrap.const';

export function prepareAppBootstrap(
  pinia: Pinia,
) {
  const loaderStore =
    useLoaderStore(pinia);

  const staticLocale =
    useStaticLocale(['loading'], pinia);

  loaderStore.registerScope({
    scopeKey: APP_BOOTSTRAP_SCOPE_KEY,
    title: staticLocale.value.loading.language,
    resources: {
      [APP_BOOTSTRAP_RESOURCES.language]: false,
    },
  });
}

export async function runAppBootstrap(
  pinia: Pinia,
) {
  const loaderStore = useLoaderStore(pinia);
  const { initializeAppLanguage } =
    useAppLanguage(pinia);

  await initializeAppLanguage();

  loaderStore.setResourceState({
    scopeKey: APP_BOOTSTRAP_SCOPE_KEY,
    resourceKey: APP_BOOTSTRAP_RESOURCES.language,
    isLoaded: true,
  });
}
