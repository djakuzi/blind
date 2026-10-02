import { getDesktopBridge } from './bridge.helper';

export function isDesktopRuntime() {
  return getDesktopBridge()?.runtime.runtime === 'desktop';
}
