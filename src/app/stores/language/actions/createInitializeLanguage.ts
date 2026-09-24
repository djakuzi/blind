import { loadLanguageLocale, loadLanguages, loadDefaultLanguageFallback, resolveInitialLanguage, saveDocumentLanguage } from '../helpers/language.helper';
import type { iLanguageState } from '../language.type';

export function createInitializeLanguage() {
  return async function initializeLanguage(
    this: iLanguageState,
  ) {
    const languages =
      await loadLanguages();

    const language =
      await resolveInitialLanguage(
        languages,
        this.preferredLanguageCode,
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
