import type { tDesktopAppPlatform } from '../../type';
import { getDesktopBridge } from './bridge.helper';

export function getDesktopPlatform(): tDesktopAppPlatform {
  const bridge = getDesktopBridge();

  if (bridge === undefined) {
    throw new Error('Desktop bridge is not available');
  }

  return bridge.runtime.platform;
}
