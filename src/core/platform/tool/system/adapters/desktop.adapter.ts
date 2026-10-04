import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import { HelperBrowserSystem } from '../helpers/browser.helper';
import type { iSystemAdapter } from '../type';

export const DesktopSystemAdapter: iSystemAdapter = {
  async getLanguage() {
    const { value } = await HelperBridge.getCapability('system').getLanguage();

    return value;
  },

  async getScale() {
    const { value } = await HelperBridge.getCapability('system').getScale();

    return value;
  },

  prefersDarkTheme: HelperBrowserSystem.prefersDarkTheme,
};
