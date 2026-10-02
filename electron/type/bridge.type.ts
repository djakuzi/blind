import type { iElectronFilesystemBridge } from './filesystem.type';
import type { tElectronPlatform } from './platform.type';
import type { iElectronStorageBridge } from './storage.type';

export interface iElectronRuntimeBridge {
  runtime: 'desktop';
  platform: tElectronPlatform;
}

export interface iElectronBridge {
  runtime: iElectronRuntimeBridge;
  filesystem: iElectronFilesystemBridge;
  storage: iElectronStorageBridge;
}
