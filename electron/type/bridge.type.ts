import type { iElectronAudioPlugin } from '../plugin/audio/type';
import type { iElectronFilesystemPlugin } from '../plugin/filesystem/type';
import type { iElectronPowerPlugin } from '../plugin/power/type';
import type { iElectronStoragePlugin } from '../plugin/storage/type';
import type { iElectronSystemPlugin } from '../plugin/system/type';
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
  power: iElectronPowerPlugin;
  storage: iElectronStoragePlugin;
  system: iElectronSystemPlugin;
  view: iElectronViewPlugin;
}
