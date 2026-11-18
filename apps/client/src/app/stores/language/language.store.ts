import { defineStore } from 'pinia';
import { createInitializeLanguage } from './actions/createInitializeLanguage';
import { createSetLanguage } from './actions/createSetLanguage';
import type { iLanguageState } from './language.type';

export const useLanguageStore = defineStore('language', {
  state: (): iLanguageState => ({
    languages: [],
    preferredLanguageCode: null,
    currentLanguage: null,
    locale: null,
    isInitialized: false,
  }),

  actions: {
    initializeLanguage: createInitializeLanguage(),
    setLanguage: createSetLanguage(),
  },
});
