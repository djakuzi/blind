import { ipcMain, net } from 'electron';
import { AUDIO_CHANNEL } from './channel';
import { HelperAudioAsset } from './helpers/asset.helper';

export function registerAudioPlugin() {
  ipcMain.removeHandler(AUDIO_CHANNEL.loadAsset);

  ipcMain.handle(AUDIO_CHANNEL.loadAsset, async (event, src: string) => {
    const url = HelperAudioAsset.resolveAssetUrl(event.sender.getURL(), src);
    const response = await net.fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load audio asset: ${src}`);
    }

    return {
      data: await response.arrayBuffer(),
    };
  });
}
