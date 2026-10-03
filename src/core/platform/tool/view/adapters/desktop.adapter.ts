import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import type { iPlatformActionResult } from '../../../type';
import type { iViewAdapter } from '../type';

function unsupported(): Promise<iPlatformActionResult> {
  return Promise.resolve({
    isHandled: false,
  });
}

export const DesktopViewAdapter: iViewAdapter = {
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
