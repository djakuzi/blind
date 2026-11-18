import { createElectronChannel } from '../../config';

export const STORAGE_CHANNEL = {
  setItem: createElectronChannel('storage', 'set-item'),
  getItem: createElectronChannel('storage', 'get-item'),
  removeItem: createElectronChannel('storage', 'remove-item'),
} as const;
