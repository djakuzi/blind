import type { iElectronAudioBridge } from './audio.type';
import type { iElectronFilesystemBridge } from './filesystem.type';
import type { tElectronPlatform } from './platform.type';
import type { iElectronStorageBridge } from './storage.type';
import type { iElectronViewBridge } from './view.type';

export interface iElectronRuntimeBridge {
  runtime: 'desktop';
  platform: tElectronPlatform;
}

export interface iElectronBridge {
  runtime: iElectronRuntimeBridge;
  audio: iElectronAudioBridge;
  filesystem: iElectronFilesystemBridge;
  storage: iElectronStorageBridge;
  view: iElectronViewBridge;
}
