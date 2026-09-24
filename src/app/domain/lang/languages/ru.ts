import type { Locale } from '../locale';

export const localeRu = {
  views: {
    menu: {
      index: {
        play: 'Играть',
        settings: 'Настройки',
        holdHint: 'Зажмите кнопку для выбора',
      },

      settings: {
        index: {
          title: 'Настройки',
          theme: 'Тема приложения',
          scale: 'Размер интерфейса',
          sound: 'Звук',
          language: 'Язык',
          accessibilityLabel: 'Настройки приложения',
          changeTheme: 'Сменить тему',
        },
      },
    },
  },

  modals: {},
} satisfies Locale;
