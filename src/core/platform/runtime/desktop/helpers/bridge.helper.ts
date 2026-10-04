import { ELECTRON_CONFIG } from '../../../../../../electron/config';
import type { iDesktopBridge } from '../type/bridge.type';

type tDesktopBridgeCapability = Exclude<keyof iDesktopBridge, 'runtime'>;
type tDesktopWindow = Window &
  Partial<Record<typeof ELECTRON_CONFIG.bridgeKey, iDesktopBridge>>;

function getDesktopBridge(): iDesktopBridge | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return (window as tDesktopWindow)[ELECTRON_CONFIG.bridgeKey];
}

function getCapability<TKey extends tDesktopBridgeCapability>(
  key: TKey,
): iDesktopBridge[TKey] {
  const bridge = getDesktopBridge();

  if (!bridge) {
    throw new Error('Desktop bridge is not available');
  }

  return bridge[key];
}

export const HelperBridge = {
  getDesktopBridge,
  getCapability,
};
