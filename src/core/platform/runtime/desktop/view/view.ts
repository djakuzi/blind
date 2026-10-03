import type { iViewAdapter } from '../../../tool/view/type';
import { HelperBridge } from '../helpers/bridge.helper';

function getViewportRatio() {
  if (typeof window === 'undefined' || window.innerHeight === 0) {
    return { value: 1 };
  }

  return { value: window.innerWidth / window.innerHeight };
}

export const RuntimeDesktopView: iViewAdapter = {
  getViewportRatio,

  async setupView(options) {
    const hasUnsupportedOptions =
      options.orientation !== undefined ||
      options.isStatusBarVisible !== undefined ||
      options.isWebViewLimitedByStatusBar !== undefined;

    return { isHandled: !hasUnsupportedOptions };
  },

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
