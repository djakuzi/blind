import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';
import { HelperAction } from '../helpers/action.helper';
import { HelperBrowserView } from '../helpers/browser.helper';
import type { iViewAdapter } from '../type';

export const MobileViewAdapter: iViewAdapter = {
  async setupView(options) {
    const operations: Promise<boolean>[] = [];

    if (options.orientation) {
      operations.push(
        HelperAction.runSafe(async () => {
          if (options.orientation === 'any') {
            await ScreenOrientation.unlock();

            return;
          }

          await ScreenOrientation.lock({
            orientation: options.orientation,
          });
        }),
      );
    }

    if (typeof options.isWebViewLimitedByStatusBar === 'boolean') {
      operations.push(
        HelperAction.runSafe(async () => {
          await StatusBar.setOverlaysWebView({
            overlay: !options.isWebViewLimitedByStatusBar,
          });
        }),
      );
    }

    if (typeof options.isStatusBarVisible === 'boolean') {
      operations.push(
        HelperAction.runSafe(async () => {
          if (options.isStatusBarVisible) {
            await StatusBar.show();

            return;
          }

          await StatusBar.hide();
        }),
      );
    }

    if (operations.length === 0) {
      return {
        isHandled: true,
      };
    }

    const results = await Promise.all(operations);

    return {
      isHandled: results.every(Boolean),
    };
  },

  isFullscreen: HelperBrowserView.isFullscreen,
  enterFullscreen: HelperBrowserView.enterFullscreen,
  exitFullscreen: HelperBrowserView.exitFullscreen,
};
