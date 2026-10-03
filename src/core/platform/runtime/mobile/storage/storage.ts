import { Preferences } from '@capacitor/preferences';
import type { iStorageAdapter } from '../../../tool/storage/type';

export const RuntimeMobileStorage: iStorageAdapter = {
  async setItem(key, value) {
    await Preferences.set({ key, value });
  },

  async getItem(key) {
    const { value } = await Preferences.get({ key });
    return { value: value ?? null };
  },

  async removeItem(key) {
    await Preferences.remove({ key });
  },
};
