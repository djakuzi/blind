import { Device } from '@capacitor/device';
import { TextZoom } from '@capacitor/text-zoom';
import { HelperMediaQuery } from '../../shared/helpers/media-query.helper';
import { HelperScale } from '../../../tool/system/helpers/scale.helper';
import type { iSystemAdapter } from '../../../tool/system/type';

export const RuntimeMobileSystem: iSystemAdapter = {
  async getSystemLanguage() {
    const { value } = await Device.getLanguageTag();
    return value;
  },

  async getSystemScale() {
    try {
      const { value } = await TextZoom.getPreferred();
      return { value: HelperScale.normalizeScaleValue(value) };
    } catch {
      return HelperScale.getDefaultScale();
    }
  },

  getPreferredThemeMode() {
    return HelperMediaQuery.matches('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  },
};
