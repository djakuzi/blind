import { Capacitor } from '@capacitor/core';

import * as viewFeature from './features/view';
import * as helpers from './helpers';
import type {
  iEnterViewFullscreenOptions,
  iSetupViewOptions,
} from './type';

export type {
  iEnterViewFullscreenOptions,
  iSetupViewOptions,
  tViewFullscreenNavigation,
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
    await viewFeature.setupNativeView(options);

    return;
  }

  await viewFeature.setupWebView(options);
}

export function isFullscreen() {
  return viewFeature.getFullscreenElement() !== null;
}

export async function enterFullscreen(options: iEnterViewFullscreenOptions = {}) {
  if (isFullscreen() || !helpers.canUseFullscreen()) {
    return;
  }

  await helpers.runSafeAsync(async () => {
    await viewFeature.enterFullscreen(options);
  });
}

export async function exitFullscreen() {
  if (!isFullscreen() || !helpers.canUseFullscreen()) {
    return;
  }

  await helpers.runSafeAsync(async () => {
    await viewFeature.exitFullscreen();
  });
}

export async function toggleFullscreen(options: iEnterViewFullscreenOptions = {}) {
  if (isFullscreen()) {
    await exitFullscreen();

    return;
  }

  await enterFullscreen(options);
}
