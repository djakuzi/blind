import type { iDesktopBridge } from '../type/bridge.type';

function getDesktopBridge(): iDesktopBridge | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.blind;
}

export const HelperBridge = {
  getDesktopBridge,
};
