import { createElectronChannel } from '../../config';

export const POWER_CHANNEL = {
  keepAwake: createElectronChannel('power', 'keep-awake'),
  allowSleep: createElectronChannel('power', 'allow-sleep'),
} as const;
