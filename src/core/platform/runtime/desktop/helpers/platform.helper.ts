import type { tDesktopAppPlatform } from '../type/platform.type';
import { HelperBridge } from './bridge.helper';

function getDesktopPlatform(): tDesktopAppPlatform {
  const bridge = HelperBridge.getDesktopBridge();

  if (bridge === undefined) {
    throw new Error('Desktop bridge is not available');
  }

  return bridge.runtime.platform;
}

export const HelperPlatform = {
  getDesktopPlatform,
};
