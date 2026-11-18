import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import { HelperBrowserStorage } from '../helpers/browser-storage.helper';
import type { iStorageAdapter } from '../type';

export const DesktopStorageAdapter: iStorageAdapter = {
  async setItem(key, value) {
    await HelperBridge.getCapability('storage').setItem(key, value);
    HelperBrowserStorage.tryGet()?.removeItem(key);
  },

  async getItem(key) {
    const storage = HelperBridge.getCapability('storage');
    const result = await storage.getItem(key);

    if (result.value !== null) {
      return result;
    }

    const legacyStorage = HelperBrowserStorage.tryGet();
    const legacyValue = legacyStorage?.getItem(key) ?? null;

    if (legacyValue === null) {
      return result;
    }

    await storage.setItem(key, legacyValue);
    legacyStorage?.removeItem(key);

    return {
      value: legacyValue,
    };
  },

  async removeItem(key) {
    await HelperBridge.getCapability('storage').removeItem(key);
    HelperBrowserStorage.tryGet()?.removeItem(key);
  },
};
