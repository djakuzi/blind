import { HelperBrowserView } from '../helpers/browser.helper';
import type { iViewAdapter } from '../type';

export const WebViewAdapter: iViewAdapter = {
  async setupView(options) {
    if (!options.orientation) {
      return {
        isHandled: true,
      };
    }

    return HelperBrowserView.setupOrientation(options.orientation);
  },

  isFullscreen: HelperBrowserView.isFullscreen,
  enterFullscreen: HelperBrowserView.enterFullscreen,
  exitFullscreen: HelperBrowserView.exitFullscreen,
};
