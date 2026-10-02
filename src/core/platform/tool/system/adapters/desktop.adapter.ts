import { HelperLanguage } from '../helpers/language.helper';
import { HelperScale } from '../helpers/scale.helper';
import { HelperTheme } from '../helpers/theme.helper';
import type { iSystemAdapter } from '../type';

export const DesktopSystemAdapter: iSystemAdapter = {
  async getSystemLanguage() {
    return HelperLanguage.getBrowserLanguage();
  },

  async getSystemScale() {
    return HelperScale.getDefaultScale();
  },

  getPreferredThemeMode() {
    return HelperTheme.getBrowserPreferredThemeMode();
  },
};
