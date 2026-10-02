import type { iBlindBridge } from '../../type';

export function getDesktopBridge(): iBlindBridge | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.blind;
}
