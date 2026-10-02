import type { iDesktopBridge } from '../type/bridge.type';

type tDesktopBridgeCapability = Exclude<keyof iDesktopBridge, 'runtime'>;

function getDesktopBridge(): iDesktopBridge | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.blind;
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
