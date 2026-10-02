import { HelperStorage } from '../helpers/storage.helper';
import type { iStorageAdapter } from '../type';

export const WebStorageAdapter: iStorageAdapter = {
  async setItem(key, value) {
    HelperStorage.getBrowserStorage().setItem(key, value);
  },

  async getItem(key) {
    return {
      value: HelperStorage.getBrowserStorage().getItem(key),
    };
  },

  async removeItem(key) {
    HelperStorage.getBrowserStorage().removeItem(key);
  },
};
