import type { Locale } from '../locale';

export const localeEn = {
  views: {
    menu: {
      index: {
        play: 'Play',
        settings: 'Settings',
        holdHint: 'Hold button to select',
      },

      settings: {
        index: {
          title: 'Settings',
          theme: 'App theme',
          scale: 'Interface size',
          sound: 'Sound',
          language: 'Language',
          accessibilityLabel: 'App settings',
          changeTheme: 'Change theme',
        },
      },
    },
  },

  modals: {},
} satisfies Locale;
