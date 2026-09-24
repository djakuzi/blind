import { ToolStorage } from '@/core/tool/storage';
import { LANGUAGE_SELECTED_CODE_STORAGE_KEY } from '../language.const';
import { findLanguageByCode, loadLanguageLocale, saveDocumentLanguage } from '../helpers/language.helper';
import type { iLanguageState } from '../language.type';

export function createSetLanguage() {
  return async function setLanguage(
    this: iLanguageState,
    code: string,
  ) {
    const language =
      findLanguageByCode(
        this.languages,
        code,
      );

    if (!language) {
      return this.currentLanguage;
    }

    const locale =
      await loadLanguageLocale(language);

    await ToolStorage.setItem(
      LANGUAGE_SELECTED_CODE_STORAGE_KEY,
      language.key,
    );

    this.currentLanguage = language;
    this.locale = locale;

    saveDocumentLanguage(language.key);

    return language;
  };
}
