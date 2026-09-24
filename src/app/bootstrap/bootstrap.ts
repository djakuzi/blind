import type { Pinia } from 'pinia';
import { useStaticLocale } from '@/app/features/settings/composables/useStaticLocale';
import { useLoaderStore } from '@/app/stores/loader/loader.store';
import { useLanguageStore } from '@/app/stores/language/language.store';
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
    title: staticLocale.value.loading.base,
    resources: {
      [APP_BOOTSTRAP_RESOURCES.language]: false,
    },
  });
}

export async function runAppBootstrap(
  pinia: Pinia,
) {
  const loaderStore = useLoaderStore(pinia);

  const languageStore = useLanguageStore(pinia);

  await languageStore.initializeLanguage();

  setTimeout( ()=> {
      loaderStore.setResourceState({
        scopeKey: APP_BOOTSTRAP_SCOPE_KEY,
        resourceKey: APP_BOOTSTRAP_RESOURCES.language,
        isLoaded: true,
      });
  }, 1000)
}
