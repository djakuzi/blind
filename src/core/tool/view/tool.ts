import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';

import * as helpers from './helpers';
import type {
  iSetupViewOptions,
  tViewOrientation,
} from './type';

export type {
  iSetupViewOptions,
  tViewOrientation,
} from './type';

export function getViewportRatio() {
  if (typeof window === 'undefined' || window.innerHeight === 0) {
    return 1;
  }

  return window.innerWidth / window.innerHeight;
}

export async function setupView(options: iSetupViewOptions) {
  if (Capacitor.isNativePlatform()) {
    await setupNativeView(options);

    return;
  }

  await setupWebView(options);
}

async function setupNativeView(options: iSetupViewOptions) {
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

async function setupWebView(options: iSetupViewOptions) {
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
