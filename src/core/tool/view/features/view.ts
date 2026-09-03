import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';

import * as helpers from '../helpers';
import type {
  iSetupViewOptions,
  tViewOrientation,
} from '../type';

export async function setupNativeView(options: iSetupViewOptions) {
  const orientation = options.orientation;

  if (orientation) {
    await helpers.runSafeAsync(async () => {
      if (orientation === 'any') {
        await ScreenOrientation.unlock();

        return;
      }

      await ScreenOrientation.lock({ orientation });
    });
  }

  await helpers.runSafeAsync(async () => {
    if (typeof options.isWebViewLimitedByStatusBar === 'boolean') {
      await StatusBar.setOverlaysWebView({
        overlay: !options.isWebViewLimitedByStatusBar,
      });
    }

    if (typeof options.isStatusBarVisible !== 'boolean') {
      return;
    }

    if (options.isStatusBarVisible) {
      await StatusBar.show();

      return;
    }

    await StatusBar.hide();
  });
}

export async function setupWebView(options: iSetupViewOptions) {
  const orientation = options.orientation;

  if (!orientation || !helpers.canUseWebScreenOrientation()) {
    return;
  }

  await helpers.runSafeAsync(async () => {
    if (orientation === 'any') {
      screen.orientation.unlock();

      return;
    }

    await lockWebScreenOrientation(orientation);
  });
}

async function lockWebScreenOrientation(orientation: Exclude<tViewOrientation, 'any'>) {
  await screen.orientation.lock(orientation);
}
