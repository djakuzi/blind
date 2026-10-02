import type { tElectronPlatform } from './platform.type';

export interface iElectronRuntimeBridge {
  runtime: 'desktop';
  platform: tElectronPlatform;
}

export interface iElectronBridge {
  runtime: iElectronRuntimeBridge;
}
