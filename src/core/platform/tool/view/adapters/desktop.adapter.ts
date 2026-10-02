import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import type { iViewAdapter } from '../type';

export const DesktopViewAdapter: iViewAdapter = {
  async setupView(options) {
    const hasUnsupportedOptions =
      options.orientation !== undefined ||
      options.isStatusBarVisible !== undefined ||
      options.isWebViewLimitedByStatusBar !== undefined;

    return {
      isHandled: !hasUnsupportedOptions,
    };
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
