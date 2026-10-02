import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import type { iStorageAdapter } from '../type';

function getStorageBridge() {
  const bridge = HelperBridge.getDesktopBridge();

  if (!bridge) {
    throw new Error('Desktop storage bridge is not available');
  }

  return bridge.storage;
}

export const DesktopStorageAdapter: iStorageAdapter = {
  setItem(key, value) {
    return getStorageBridge().setItem(key, value);
  },

  getItem(key) {
    return getStorageBridge().getItem(key);
  },

  removeItem(key) {
    return getStorageBridge().removeItem(key);
  },
};
