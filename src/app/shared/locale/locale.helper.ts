import { LibLocale } from '@/core/lib/locale';
import { STATIC_LOCALE_DEFAULT_LANGUAGE, STATIC_LOCALE_REGISTRY } from './locale.registry';
import type { iStaticLocale } from './locale.type';
import type { tStaticLocaleLanguage } from './locale.registry';

function isStaticLocaleLanguage(code: string): code is tStaticLocaleLanguage {
  return code in STATIC_LOCALE_REGISTRY;
}

export function getStaticLocale(code: string | null): iStaticLocale {
  if (!code) {
    return STATIC_LOCALE_REGISTRY[STATIC_LOCALE_DEFAULT_LANGUAGE];
  }

  const normalizedCode = LibLocale.normalizeCode(code);

  if (isStaticLocaleLanguage(normalizedCode.exact)) {
    return STATIC_LOCALE_REGISTRY[normalizedCode.exact];
  }

  if (isStaticLocaleLanguage(normalizedCode.base)) {
    return STATIC_LOCALE_REGISTRY[normalizedCode.base];
  }

  return STATIC_LOCALE_REGISTRY[STATIC_LOCALE_DEFAULT_LANGUAGE];
}
