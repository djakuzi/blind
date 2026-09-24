import { computed } from 'vue';
import type { Pinia } from 'pinia';
import { useLanguageStore } from '@/app/stores/language/language.store';
import { applyAppLanguage } from '../helpers/applyAppLanguage.helper';

export function useAppLanguage(
  pinia?: Pinia,
) {
  const languageStore =
    useLanguageStore(pinia);

  const languages = computed(() =>
    languageStore.languages,
  );

  const currentLanguage = computed(() =>
    languageStore.currentLanguage,
  );

  async function initializeAppLanguage() {
    const language =
      await languageStore.initializeLanguage();

    applyAppLanguage(language.key);

    return language;
  }

  async function setAppLanguage(
    code: string,
  ) {
    const language =
      await languageStore.setLanguage(code);

    if (language) {
      applyAppLanguage(language.key);
    }

    return language;
  }

  return {
    languages,
    currentLanguage,
    initializeAppLanguage,
    setAppLanguage,
  };
}
