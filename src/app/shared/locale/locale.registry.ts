import type { iStaticLocale } from './locale.type';

export const STATIC_LOCALE_REGISTRY = {
  en: {
    loading: {
      base: 'Loading',
      language: 'Checking your language',
    },
  },
  ru: {
    loading: {
      base: 'Загрузка',
      language: 'Проверяем ваш язык',
    },
  },
} satisfies Record<string, iStaticLocale>;

export const STATIC_LOCALE_DEFAULT_LANGUAGE = 'en';

export type tStaticLocaleLanguage = keyof typeof STATIC_LOCALE_REGISTRY;
