import type { iPlatformActionResult } from '../../../type';
import type { iViewAdapter } from '../../../tool/view/type';
import { HelperBridge } from '../helpers/bridge.helper';

function unsupported(): Promise<iPlatformActionResult> {
  return Promise.resolve({
    isHandled: false,
  });
}

export const RuntimeDesktopView: iViewAdapter = {
  getViewportSize() {
    return {
      value: {
        width: typeof window === 'undefined' ? 0 : window.innerWidth,
        height: typeof window === 'undefined' ? 0 : window.innerHeight,
      },
    };
  },

  setOrientation: unsupported,
  setStatusBarVisible: unsupported,
  setWebViewLimitedByStatusBar: unsupported,

  isFullscreen() {
    return HelperBridge.getCapability('view').isFullscreen();
  },

  enterFullscreen() {
    return HelperBridge.getCapability('view').enterFullscreen();
  },

  exitFullscreen() {
    return HelperBridge.getCapability('view').exitFullscreen();
  },
};
