import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import type { Pinia } from 'pinia';
import type { Locale } from '@/app/shared/types/locale';
import { useLanguageStore } from '@/app/stores/language/language.store';

export function useLocale<TResult = Locale>(
  selector?: (locale: Locale) => TResult,
  pinia?: Pinia,
): ComputedRef<TResult> {
  const languageStore =
    useLanguageStore(pinia);

  return computed(() => {
    if (!languageStore.locale) {
      throw new Error('Locale is not initialized');
    }

    if (!selector) {
      return languageStore.locale as TResult;
    }

    return selector(languageStore.locale);
  });
}
