import type { iElectronAudioPlugin } from '../plugin/audio/type';
import type { iElectronFilesystemPlugin } from '../plugin/filesystem/type';
import type { iElectronStoragePlugin } from '../plugin/storage/type';
import type { iElectronViewPlugin } from '../plugin/view/type';
import type { tElectronPlatform } from './platform.type';

export interface iElectronRuntimeBridge {
  runtime: 'desktop';
  platform: tElectronPlatform;
}

export interface iElectronBridge {
  runtime: iElectronRuntimeBridge;
  audio: iElectronAudioPlugin;
  filesystem: iElectronFilesystemPlugin;
  storage: iElectronStoragePlugin;
  view: iElectronViewPlugin;
}
