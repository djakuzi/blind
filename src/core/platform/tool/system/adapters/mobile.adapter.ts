import { Device } from '@capacitor/device';
import { TextZoom } from '@capacitor/text-zoom';
import { HelperScale } from '../helpers/scale.helper';
import { HelperTheme } from '../helpers/theme.helper';
import type { iSystemAdapter } from '../type';

export const MobileSystemAdapter: iSystemAdapter = {
  async getSystemLanguage() {
    const { value } = await Device.getLanguageTag();

    return value;
  },

  async getCurrentScale() {
    try {
      const { value } = await TextZoom.get();

      return {
        value: HelperScale.normalizeScaleValue(value),
      };
    } catch {
      return HelperScale.getDefaultScale();
    }
  },

  async getPreferredScale() {
    try {
      const { value } = await TextZoom.getPreferred();

      return {
        value: HelperScale.normalizeScaleValue(value),
      };
    } catch {
      return HelperScale.getDefaultScale();
    }
  },

  async getSystemScale() {
    return this.getPreferredScale();
  },

  getPreferredThemeMode() {
    return HelperTheme.getBrowserPreferredThemeMode();
  },
};
