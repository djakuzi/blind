import { ToolStorage } from '@/core/tool/storage';
import { LANGUAGE_SELECTED_CODE_STORAGE_KEY } from '../language.const';
import { loadLanguageLocale, loadLanguages, loadDefaultLanguageFallback, resolveInitialLanguage, saveDocumentLanguage } from '../helpers/language.helper';
import type { iLanguageState } from '../language.type';

export function createLoadLanguage() {
  return async function loadLanguage(
    this: iLanguageState,
  ) {
    const languages =
      await loadLanguages();

    const selectedCode =
      await ToolStorage.getItem(
        LANGUAGE_SELECTED_CODE_STORAGE_KEY,
      );

    const language =
      await resolveInitialLanguage(
        languages,
        selectedCode,
      );

    if (!language) {
      this.languages = languages;
      this.currentLanguage = null;
      this.locale = null;
      this.isInitialized = true;

      return null;
    }

    let currentLanguage =
      language;

    let locale;

    try {
      locale =
        await loadLanguageLocale(language);
    } catch {
      const fallback =
        await loadDefaultLanguageFallback();

      currentLanguage =
        fallback.language;
      locale =
        fallback.locale;
    }

    this.languages = languages;
    this.currentLanguage = currentLanguage;
    this.locale = locale;
    this.isInitialized = true;

    saveDocumentLanguage(currentLanguage.key);

    return currentLanguage;
  };
}
