import { createElectronChannel } from '../../config';

export const SYSTEM_CHANNEL = {
  getLanguage: createElectronChannel('system', 'get-language'),
  getScale: createElectronChannel('system', 'get-scale'),
  setThemeSource: createElectronChannel('system', 'set-theme-source'),
} as const;
