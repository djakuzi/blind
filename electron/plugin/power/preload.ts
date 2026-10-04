import { ipcRenderer } from 'electron';
import { POWER_CHANNEL } from './channel';
import type { iElectronPowerPlugin } from './type';

export const PowerPreloadPlugin: iElectronPowerPlugin = {
  keepAwake() {
    return ipcRenderer.invoke(POWER_CHANNEL.keepAwake);
  },

  allowSleep() {
    return ipcRenderer.invoke(POWER_CHANNEL.allowSleep);
  },
};
