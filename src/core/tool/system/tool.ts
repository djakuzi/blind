import { Capacitor } from '@capacitor/core';
import { ScreenOrientation, type OrientationLockType } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';
import { TextZoom } from '@capacitor/text-zoom';

import { DEFAULT_SCALE_VALUE } from './const';
import * as helpers from './helpers';

export type tSystemThemeMode = 'light' | 'dark';
export type tSystemViewOrientation = Extract<OrientationLockType, 'any' | 'landscape' | 'portrait'>;

export interface iSetupSystemViewOptions {
  orientation?: tSystemViewOrientation
  isStatusBarVisible?: boolean
  isWebViewLimitedByStatusBar?: boolean
}

export function getPlatform() {
  return Capacitor.getPlatform();
}

export function isNativePlatform() {
  return Capacitor.isNativePlatform();
}

export async function getCurrentScale() {
  if (getPlatform() === 'web' || !Capacitor.isPluginAvailable('TextZoom')) {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }

  try {
    const { value } = await TextZoom.get();
    return {
      value: helpers.normalizeScaleValue(value),
    };
  } catch {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }
}

export async function getPreferredScale() {
  if (getPlatform() === 'web' || !Capacitor.isPluginAvailable('TextZoom')) {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }

  try {
    const { value } = await TextZoom.getPreferred();
    return {
      value: helpers.normalizeScaleValue(value),
    };
  } catch {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }
}

export async function getSystemScale() {
  return getPreferredScale();
}

export function getPreferredThemeMode(): tSystemThemeMode {
  if (typeof globalThis.matchMedia !== 'function') {
    return 'light';
  }

  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function getViewportRatio() {
  if (typeof window === 'undefined' || window.innerHeight === 0) {
    return 1;
  }

  return window.innerWidth / window.innerHeight;
}

export async function setupView(options: iSetupSystemViewOptions) {
  if (isNativePlatform()) {
    await setupNativeView(options);

    return;
  }

  await setupWebView(options);
}

async function setupNativeView(options: iSetupSystemViewOptions) {
  await setupNativeViewOrientation(options.orientation);
  await setupNativeStatusBar(options);
}

async function setupNativeViewOrientation(orientation: tSystemViewOrientation | undefined) {
  if (!orientation || !Capacitor.isPluginAvailable('ScreenOrientation')) {
    return;
  }

  try {
    if (orientation === 'any') {
      await ScreenOrientation.unlock();

      return;
    }

    await ScreenOrientation.lock({ orientation });
  } catch {
    return;
  }
}

async function setupNativeStatusBar(options: iSetupSystemViewOptions) {
  if (!Capacitor.isPluginAvailable('StatusBar')) {
    return;
  }

  try {
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
  } catch {
    return;
  }
}

async function setupWebView(options: iSetupSystemViewOptions) {
  await setupWebViewOrientation(options.orientation);
}

async function setupWebViewOrientation(orientation: tSystemViewOrientation | undefined) {
  if (!orientation || typeof screen === 'undefined' || !screen.orientation) {
    return;
  }

  try {
    if (orientation === 'any') {
      screen.orientation.unlock();

      return;
    }

    await screen.orientation.lock(orientation);
  } catch {
    return;
  }
}
