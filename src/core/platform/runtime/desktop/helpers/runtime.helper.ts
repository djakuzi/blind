import { HelperBridge } from './bridge.helper';

function isDesktopRuntime() {
  return HelperBridge.getDesktopBridge()?.runtime.runtime === 'desktop';
}

export const HelperRuntime = {
  isDesktopRuntime,
};
