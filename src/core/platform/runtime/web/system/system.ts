import type { iSystemAdapter } from '../../../tool/system/type';
import { HelperMediaQuery } from '../../shared/helpers/media-query.helper';

export const RuntimeWebSystem: iSystemAdapter = {
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
