import { createElectronChannel } from '../../config';

export const AUDIO_CHANNEL = {
  loadAsset: createElectronChannel('audio', 'load-asset'),
} as const;
