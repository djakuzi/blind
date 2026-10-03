import { HelperMediaQuery } from '../../shared/helpers/media-query.helper';
import type { iSystemAdapter } from '../../../tool/system/type';

export const RuntimeDesktopSystem: iSystemAdapter = {
  async getSystemLanguage() {
    if (typeof navigator === 'undefined' || !navigator.language) {
      throw new Error('System language is not available');
    }

    return navigator.language;
  },

  async getSystemScale() {
    return { value: 1 };
  },

  getPreferredThemeMode() {
    return HelperMediaQuery.matches('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  },
};
