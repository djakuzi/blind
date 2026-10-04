import { ipcRenderer } from 'electron';
import { STORAGE_CHANNEL } from './channel';
import type { iElectronStoragePlugin } from './type';

export const StoragePreloadPlugin: iElectronStoragePlugin = {
  setItem(key, value) {
    return ipcRenderer.invoke(STORAGE_CHANNEL.setItem, key, value);
  },

  getItem(key) {
    return ipcRenderer.invoke(STORAGE_CHANNEL.getItem, key);
  },

  removeItem(key) {
    return ipcRenderer.invoke(STORAGE_CHANNEL.removeItem, key);
  },
};
