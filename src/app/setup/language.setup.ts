import type { Pinia } from 'pinia';
import { useLanguageStore } from '@/app/stores/language/language.store';
import { normalizeLanguageCodes } from '@/app/stores/language/helpers/language.helper';
import { LANGUAGE_SELECTED_CODE_STORAGE_KEY } from '@/app/stores/language/language.const';
import { ToolStorage } from '@/core/tool/storage';
import { ToolSystem } from '@/core/tool/system';

export async function setupLanguage(
  pinia: Pinia,
) {
  const languageStore =
    useLanguageStore(pinia);

  const selectedCode =
    await ToolStorage.getItem(
      LANGUAGE_SELECTED_CODE_STORAGE_KEY,
    );

  if (selectedCode) {
    languageStore.preferredLanguageCode = selectedCode;

    return;
  }

  try {
    const systemCode =
      await ToolSystem.getSystemLanguage();

    languageStore.preferredLanguageCode =
      normalizeLanguageCodes(systemCode).exact;
  } catch {
    languageStore.preferredLanguageCode = null;
  }
}
