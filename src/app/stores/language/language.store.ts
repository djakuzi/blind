import { defineStore } from 'pinia';
import { createLoadLanguage } from './actions/createLoadLanguage';
import { createSetLanguage } from './actions/createSetLanguage';
import type { iLanguageState } from './language.type';

export const useLanguageStore = defineStore('language', {
  state: (): iLanguageState => ({
    languages: [],
    currentLanguage: null,
    locale: null,
    isInitialized: false,
  }),

  actions: {
    loadLanguage: createLoadLanguage(),
    setLanguage: createSetLanguage(),
  },
});
