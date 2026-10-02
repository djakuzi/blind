import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import type { iStorageAdapter } from '../type';

function getStorageBridge() {
  const bridge = HelperBridge.getDesktopBridge();

  if (!bridge) {
    throw new Error('Desktop storage bridge is not available');
  }

  return bridge.storage;
}

function getLegacyStorage() {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export const DesktopStorageAdapter: iStorageAdapter = {
  async setItem(key, value) {
    await getStorageBridge().setItem(key, value);
    getLegacyStorage()?.removeItem(key);
  },

  async getItem(key) {
    const result = await getStorageBridge().getItem(key);

    if (result.value !== null) {
      return result;
    }

    const legacyStorage = getLegacyStorage();
    const legacyValue = legacyStorage?.getItem(key) ?? null;

    if (legacyValue === null) {
      return result;
    }

    await getStorageBridge().setItem(key, legacyValue);
    legacyStorage?.removeItem(key);

    return {
      value: legacyValue,
    };
  },

  async removeItem(key) {
    await getStorageBridge().removeItem(key);
    getLegacyStorage()?.removeItem(key);
  },
};
