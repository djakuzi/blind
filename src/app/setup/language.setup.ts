import type { Pinia } from 'pinia';
import { useLanguageStore } from '@/app/stores/language/language.store';

export async function setupLanguage(
  pinia: Pinia,
) {
  const languageStore =
    useLanguageStore(pinia);

  await languageStore.loadLanguage();
}
