import type { iStaticLocale } from './locale.type';

export const STATIC_LOCALE_REGISTRY = {
  en: {
    loading: {
      base: 'Loading',
      language: 'Checking your language',
      languageError: 'Failed to load language',
      retry: 'Retry',
    },
  },
  ru: {
    loading: {
      base: 'Загрузка',
      language: 'Проверяем ваш язык',
      languageError: 'Не удалось загрузить язык',
      retry: 'Повторить',
    },
  },
} satisfies Record<string, iStaticLocale>;

export const STATIC_LOCALE_DEFAULT_LANGUAGE = 'en';

export type tStaticLocaleLanguage = keyof typeof STATIC_LOCALE_REGISTRY;
