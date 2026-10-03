import { HelperViewAction } from '../helpers/action.helper';
import { HelperBrowserView } from '../helpers/browser.helper';
import type { iViewAdapter } from '../type';

export const WebViewAdapter: iViewAdapter = {
  getViewportSize: HelperBrowserView.getViewportSize,
  setOrientation: HelperBrowserView.setOrientation,
  setStatusBarVisible: HelperViewAction.unsupported,
  setWebViewLimitedByStatusBar: HelperViewAction.unsupported,
  isFullscreen: HelperBrowserView.isFullscreen,
  enterFullscreen: HelperBrowserView.enterFullscreen,
  exitFullscreen: HelperBrowserView.exitFullscreen,
};
