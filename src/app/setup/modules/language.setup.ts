import type { Pinia } from 'pinia';
import { useAppLanguage } from '@/app/features/locale/composables/useAppLanguage';
import { useStaticLocale } from '@/app/features/locale/composables/useStaticLocale';
import { useLoaderStore } from '@/app/stores/loader/loader.store';
import { normalizeLanguageCodes } from '@/app/stores/language/helpers/language.helper';
import { LANGUAGE_SELECTED_CODE_STORAGE_KEY } from '@/app/stores/language/language.const';
import { useLanguageStore } from '@/app/stores/language/language.store';
import { ToolStorage } from '@/core/tool/storage';
import { ToolSystem } from '@/core/tool/system';
import type { iAppSetup } from '../core/setup.type';

const APP_SETUP_LANGUAGE_SCOPE_KEY =
  'app-setup-language';

const APP_SETUP_LANGUAGE_RESOURCE_KEY =
  'language';

export function createLanguageSetup(
  pinia: Pinia,
): iAppSetup {
  const languageStore =
    useLanguageStore(pinia);

  const loaderStore =
    useLoaderStore(pinia);

  const { initializeAppLanguage } = useAppLanguage(pinia);

  const staticLocale =
    useStaticLocale(['loading'], pinia);

  return {
    key: 'language',

    async preMount() {
      const selectedCode =
        await ToolStorage.getItem(
          LANGUAGE_SELECTED_CODE_STORAGE_KEY,
        );

      if (selectedCode) {
        languageStore.preferredLanguageCode =
          selectedCode;
      } else {
        try {
          const systemCode =
            await ToolSystem.getSystemLanguage();

          languageStore.preferredLanguageCode =
            normalizeLanguageCodes(systemCode).exact;
        } catch {
          languageStore.preferredLanguageCode =
            null;
        }
      }

      loaderStore.registerScope({
        scopeKey: APP_SETUP_LANGUAGE_SCOPE_KEY,
        title: staticLocale.value.loading.language,
        resources: {
          [APP_SETUP_LANGUAGE_RESOURCE_KEY]: false,
        },
      });
    },

    postMount: {
      mode: 'blocking',

      async run() {
        await initializeAppLanguage();

        loaderStore.setResourceState({
          scopeKey: APP_SETUP_LANGUAGE_SCOPE_KEY,
          resourceKey:
            APP_SETUP_LANGUAGE_RESOURCE_KEY,
          isLoaded: true,
        });
      },
    },
  };
}
