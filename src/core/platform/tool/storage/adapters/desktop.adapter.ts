import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import type { iStorageAdapter } from '../type';

function getLegacyStorage() {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export const DesktopStorageAdapter: iStorageAdapter = {
  async setItem(key, value) {
    await HelperBridge.getCapability('storage').setItem(key, value);
    getLegacyStorage()?.removeItem(key);
  },

  async getItem(key) {
    const storage = HelperBridge.getCapability('storage');
    const result = await storage.getItem(key);

    if (result.value !== null) {
      return result;
    }

    const legacyStorage = getLegacyStorage();
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
    getLegacyStorage()?.removeItem(key);
  },
};
