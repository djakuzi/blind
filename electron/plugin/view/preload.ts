import { ipcRenderer } from 'electron';
import { VIEW_CHANNEL } from './channel';
import type { iElectronViewPlugin } from './type';

export const ViewPreloadPlugin: iElectronViewPlugin = {
  isFullscreen() {
    return ipcRenderer.invoke(VIEW_CHANNEL.isFullscreen);
  },

  enterFullscreen() {
    return ipcRenderer.invoke(VIEW_CHANNEL.enterFullscreen);
  },

  exitFullscreen() {
    return ipcRenderer.invoke(VIEW_CHANNEL.exitFullscreen);
  },
};
