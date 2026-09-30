import type { iStaticLocale } from './locale.type';

export const STATIC_LOCALE_REGISTRY = {
  en: {
    loading: {
      base: 'Loading',
      language: 'Checking your language',
      languageError: 'Failed to load language',
      audio: 'Loading audio',
      audioError: 'Failed to load audio',
      retry: 'Retry',
    },
  },
  ru: {
    loading: {
      base: 'Загрузка',
      language: 'Проверяем ваш язык',
      languageError: 'Не удалось загрузить язык',
      audio: 'Загружаем звук',
      audioError: 'Не удалось загрузить звук',
      retry: 'Повторить',
    },
  },
} satisfies Record<string, iStaticLocale>;

export const STATIC_LOCALE_DEFAULT_LANGUAGE = 'en';

export type tStaticLocaleLanguage = keyof typeof STATIC_LOCALE_REGISTRY;
