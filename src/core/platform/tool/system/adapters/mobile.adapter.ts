import { Device } from '@capacitor/device';
import { TextZoom } from '@capacitor/text-zoom';
import { HelperScale } from '../helpers/scale.helper';
import { HelperTheme } from '../helpers/theme.helper';
import type { iSystemAdapter, iSystemScale } from '../type';

async function getPreferredScale(): Promise<iSystemScale> {
  try {
    const { value } = await TextZoom.getPreferred();

    return {
      value: HelperScale.normalizeScaleValue(value),
    };
  } catch {
    return HelperScale.getDefaultScale();
  }
}

export const MobileSystemAdapter: iSystemAdapter = {
  async getSystemLanguage() {
    const { value } = await Device.getLanguageTag();

    return value;
  },

  getSystemScale() {
    return getPreferredScale();
  },

  getPreferredThemeMode() {
    return HelperTheme.getBrowserPreferredThemeMode();
  },
};
