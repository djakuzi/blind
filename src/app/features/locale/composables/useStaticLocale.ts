import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import type { Pinia } from 'pinia';
import { getStaticLocale } from '@/app/shared/locale/locale.helper';
import type { iStaticLocale } from '@/app/shared/locale/locale.type';
import { useLanguageStore } from '@/app/stores/language/language.store';

type tStaticLocaleSection =
  keyof iStaticLocale;

type tStaticLocaleResult<TSection extends tStaticLocaleSection> =
  Pick<iStaticLocale, TSection>;

function pickStaticLocaleSections<TSection extends tStaticLocaleSection>(
  staticLocale: iStaticLocale,
  sections: readonly TSection[],
) {
  return sections.reduce(
    (result, section) => ({
      ...result,
      [section]: staticLocale[section],
    }),
    {} as tStaticLocaleResult<TSection>,
  );
}

export function useStaticLocale<
  TSection extends tStaticLocaleSection = tStaticLocaleSection,
>(
  sections?: readonly TSection[],
  pinia?: Pinia,
): ComputedRef<tStaticLocaleResult<TSection>> {
  const languageStore = useLanguageStore(pinia);

  return computed(() => {
    const staticLocale =
      getStaticLocale(
        languageStore.currentLanguage?.key
          ?? languageStore.preferredLanguageCode,
      );

    if (!sections) {
      return staticLocale as tStaticLocaleResult<TSection>;
    }

    return pickStaticLocaleSections(
      staticLocale,
      sections,
    );
  });
}
