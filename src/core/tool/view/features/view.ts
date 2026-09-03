import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';

import * as helpers from '../helpers';
import type {
  iEnterViewFullscreenOptions,
  iSetupViewOptions,
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

    await screen.orientation.lock(orientation);
  });
}

export function getFullscreenElement() {
  if (typeof document === 'undefined') {
    return null;
  }

  return document.fullscreenElement;
}

export async function enterFullscreen(options: iEnterViewFullscreenOptions) {
  const target = options.target ?? document.documentElement;

  await target.requestFullscreen({
    navigationUI: options.navigation,
  });
}

export async function exitFullscreen() {
  await document.exitFullscreen();
}
