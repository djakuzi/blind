import type { iStorageAdapter } from '../../../tool/storage/type';

function getStorage() {
  if (typeof localStorage === 'undefined') {
    throw new Error('Browser storage is not available');
  }

  return localStorage;
}

export const RuntimeWebStorage: iStorageAdapter = {
  async setItem(key, value) {
    getStorage().setItem(key, value);
  },

  async getItem(key) {
    return { value: getStorage().getItem(key) };
  },

  async removeItem(key) {
    getStorage().removeItem(key);
  },
};
