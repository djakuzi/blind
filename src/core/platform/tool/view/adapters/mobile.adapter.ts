import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';
import { HelperAction } from '../helpers/action.helper';
import { HelperBrowserView } from '../helpers/browser.helper';
import type { iViewAdapter } from '../type';

export const MobileViewAdapter: iViewAdapter = {
  async setupView(options) {
    let isHandled = true;

    const orientation = options.orientation;

    if (orientation) {
      const isOrientationHandled = await HelperAction.runSafe(async () => {
        if (orientation === 'any') {
          await ScreenOrientation.unlock();

          return;
        }

        await ScreenOrientation.lock({
          orientation,
        });
      });

      isHandled = isOrientationHandled && isHandled;
    }

    const isWebViewLimitedByStatusBar = options.isWebViewLimitedByStatusBar;

    if (typeof isWebViewLimitedByStatusBar === 'boolean') {
      const isOverlayHandled = await HelperAction.runSafe(async () => {
        await StatusBar.setOverlaysWebView({
          overlay: !isWebViewLimitedByStatusBar,
        });
      });

      isHandled = isOverlayHandled && isHandled;
    }

    const isStatusBarVisible = options.isStatusBarVisible;

    if (typeof isStatusBarVisible === 'boolean') {
      const isVisibilityHandled = await HelperAction.runSafe(async () => {
        if (isStatusBarVisible) {
          await StatusBar.show();

          return;
        }

        await StatusBar.hide();
      });

      isHandled = isVisibilityHandled && isHandled;
    }

    return {
      isHandled,
    };
  },

  isFullscreen: HelperBrowserView.isFullscreen,
  enterFullscreen: HelperBrowserView.enterFullscreen,
  exitFullscreen: HelperBrowserView.exitFullscreen,
};
