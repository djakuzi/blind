import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import { HelperWebAudio } from '../helpers/web-audio.helper';

async function loadDesktopAudioData(src: string) {
  const { data } = await HelperBridge.getCapability('audio').loadAsset(src);

  return data;
}

export const DesktopAudioAdapter = HelperWebAudio.createAdapter(loadDesktopAudioData);
