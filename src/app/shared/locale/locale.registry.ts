import type { iStaticLocale } from './locale.type';

export const STATIC_LOCALE_REGISTRY = {
  en: {
    loading: {
      base: 'Loading',
      language: 'Finding the right words',
      languageError: 'Failed to load language',
      audio: 'Tuning your hearing',
      audioError: 'Failed to load audio',
      gameModes: 'Preparing game modes',
      gameModesError: 'Failed to load game modes',
      retry: 'Retry',
    },
  },
  ru: {
    loading: {
      base: 'Загрузка',
      language: 'Подбираем слова',
      languageError: 'Не удалось загрузить язык',
      audio: 'Настраиваем слух',
      audioError: 'Не удалось загрузить звук',
      gameModes: 'Готовим режимы игры',
      gameModesError: 'Не удалось загрузить режимы игры',
      retry: 'Повторить',
    },
  },
} satisfies Record<string, iStaticLocale>;

export const STATIC_LOCALE_DEFAULT_LANGUAGE = 'en';

export type tStaticLocaleLanguage = keyof typeof STATIC_LOCALE_REGISTRY;
