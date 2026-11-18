import type { iElectronBridge, iElectronRuntimeBridge } from '../../../../../../electron/type';
import type { tDesktopAppPlatform } from './platform.type';

export interface iDesktopRuntimeBridge extends iElectronRuntimeBridge {
  platform: tDesktopAppPlatform;
}

export interface iDesktopBridge extends iElectronBridge {
  runtime: iDesktopRuntimeBridge;
}
