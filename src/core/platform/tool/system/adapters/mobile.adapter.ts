import { Device } from '@capacitor/device';
import { TextZoom } from '@capacitor/text-zoom';
import { HelperMediaQuery } from '../../../runtime/shared/helpers/media-query.helper';
import type { iSystemAdapter } from '../type';

export const MobileSystemAdapter: iSystemAdapter = {
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
