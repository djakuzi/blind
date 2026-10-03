import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import { HelperViewAction } from '../helpers/action.helper';
import { HelperBrowserView } from '../helpers/browser.helper';
import type { iViewAdapter } from '../type';

export const DesktopViewAdapter: iViewAdapter = {
  getViewportSize: HelperBrowserView.getViewportSize,
  setOrientation: HelperViewAction.unsupported,
  setStatusBarVisible: HelperViewAction.unsupported,
  setWebViewLimitedByStatusBar: HelperViewAction.unsupported,

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
