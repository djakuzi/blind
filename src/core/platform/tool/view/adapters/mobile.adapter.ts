import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';
import { HelperViewAction } from '../helpers/action.helper';
import { HelperBrowserView } from '../helpers/browser.helper';
import type { iViewAdapter } from '../type';

export const MobileViewAdapter: iViewAdapter = {
  getViewportSize: HelperBrowserView.getViewportSize,

  async setOrientation(orientation) {
    return {
      isHandled: await HelperViewAction.runSafe(async () => {
        if (orientation === 'any') {
          await ScreenOrientation.unlock();
          return;
        }

        await ScreenOrientation.lock({
          orientation,
        });
      }),
    };
  },

  async setStatusBarVisible(value) {
    return {
      isHandled: await HelperViewAction.runSafe(async () => {
        if (value) {
          await StatusBar.show();
          return;
        }

        await StatusBar.hide();
      }),
    };
  },

  async setWebViewLimitedByStatusBar(value) {
    return {
      isHandled: await HelperViewAction.runSafe(async () => {
        await StatusBar.setOverlaysWebView({
          overlay: !value,
        });
      }),
    };
  },

  isFullscreen: HelperBrowserView.isFullscreen,
  enterFullscreen: HelperBrowserView.enterFullscreen,
  exitFullscreen: HelperBrowserView.exitFullscreen,
};
