import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import { HelperWebAudio } from '../helpers/web-audio.helper';

async function loadDesktopAudioData(src: string) {
  const bridge = HelperBridge.getDesktopBridge();

  if (!bridge) {
    throw new Error('Desktop audio bridge is not available');
  }

  const { data } = await bridge.audio.loadAsset(src);

  return data;
}

export const DesktopAudioAdapter = HelperWebAudio.createAdapter(loadDesktopAudioData);
