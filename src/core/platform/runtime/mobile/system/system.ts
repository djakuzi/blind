import { Device } from '@capacitor/device';
import { TextZoom } from '@capacitor/text-zoom';
import type { iSystemAdapter } from '../../../tool/system/type';
import { HelperMediaQuery } from '../../shared/helpers/media-query.helper';

export const RuntimeMobileSystem: iSystemAdapter = {
  async getLanguage() {
    const { value } = await Device.getLanguageTag();

    return value;
  },

  async getScale() {
    try {
      const { value } = await TextZoom.getPreferred();

      return value;
    } catch {
      return null;
    }
  },

  prefersDarkTheme() {
    return HelperMediaQuery.matches('(prefers-color-scheme: dark)');
  },
};
