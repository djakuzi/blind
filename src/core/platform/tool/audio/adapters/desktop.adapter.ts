import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import { WebAudioEngine } from '../engines/web-audio.engine';

async function loadDesktopAudioData(src: string) {
  const { data } = await HelperBridge.getCapability('audio').loadAsset(src);

  return data;
}

export const DesktopAudioAdapter = WebAudioEngine.createAdapter(loadDesktopAudioData);
