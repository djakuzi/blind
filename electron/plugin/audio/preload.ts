import { ipcRenderer } from 'electron';
import { AUDIO_CHANNEL } from './channel';
import type { iElectronAudioPlugin } from './type';

export const AudioPreloadPlugin: iElectronAudioPlugin = {
  loadAsset(src) {
    return ipcRenderer.invoke(AUDIO_CHANNEL.loadAsset, src);
  },
};
