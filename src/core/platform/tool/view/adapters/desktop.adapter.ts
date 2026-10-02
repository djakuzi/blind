import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import type { iViewAdapter } from '../type';

function getViewBridge() {
  const bridge = HelperBridge.getDesktopBridge();

  if (!bridge) {
    throw new Error('Desktop view bridge is not available');
  }

  return bridge.view;
}

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
    return getViewBridge().isFullscreen();
  },

  enterFullscreen() {
    return getViewBridge().enterFullscreen();
  },

  exitFullscreen() {
    return getViewBridge().exitFullscreen();
  },
};
