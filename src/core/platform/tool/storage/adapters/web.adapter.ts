import { HelperBrowserStorage } from '../helpers/browser-storage.helper';
import type { iStorageAdapter } from '../type';

export const WebStorageAdapter: iStorageAdapter = {
  async setItem(key, value) {
    HelperBrowserStorage.get().setItem(key, value);
  },

  async getItem(key) {
    return {
      value: HelperBrowserStorage.get().getItem(key),
    };
  },

  async removeItem(key) {
    HelperBrowserStorage.get().removeItem(key);
  },
};
