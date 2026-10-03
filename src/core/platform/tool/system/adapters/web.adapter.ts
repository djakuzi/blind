import { HelperMediaQuery } from '../../../runtime/shared/helpers/media-query.helper';
import type { iSystemAdapter } from '../type';

export const WebSystemAdapter: iSystemAdapter = {
  async getLanguage() {
    if (typeof navigator === 'undefined' || !navigator.language) {
      throw new Error('System language is not available');
    }

    return navigator.language;
  },

  async getScale() {
    return null;
  },

  prefersDarkTheme() {
    return HelperMediaQuery.matches('(prefers-color-scheme: dark)');
  },
};
