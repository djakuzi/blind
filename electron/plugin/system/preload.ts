import { ipcRenderer } from 'electron';
import { SYSTEM_CHANNEL } from './channel';
import type { iElectronSystemPlugin } from './type';

export const SystemPreloadPlugin: iElectronSystemPlugin = {
  getLanguage() {
    return ipcRenderer.invoke(SYSTEM_CHANNEL.getLanguage);
  },

  getScale() {
    return ipcRenderer.invoke(SYSTEM_CHANNEL.getScale);
  },

  setThemeSource(themeSource) {
    return ipcRenderer.invoke(SYSTEM_CHANNEL.setThemeSource, themeSource);
  },
};
