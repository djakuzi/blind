import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import { createWebAudioEngine } from '../engines/web-audio.engine';

async function loadAudioData(src: string) {
  const { data } = await HelperBridge.getCapability('audio').loadAsset(src);

  return data;
}

export const DesktopAudioAdapter = createWebAudioEngine(loadAudioData);
