import { HelperBrowserSystem } from '../helpers/browser.helper';
import type { iSystemAdapter } from '../type';

export const BrowserSystemAdapter: iSystemAdapter = {
  async getLanguage() {
    return HelperBrowserSystem.getLanguage();
  },

  async getScale() {
    return null;
  },

  prefersDarkTheme: HelperBrowserSystem.prefersDarkTheme,
};
