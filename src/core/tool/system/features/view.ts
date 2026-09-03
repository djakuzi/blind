import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';

import type { tSystemViewOrientation } from '../type';

export function canUseNativeScreenOrientation() {
  return Capacitor.isPluginAvailable('ScreenOrientation');
}

export function canUseNativeStatusBar() {
  return Capacitor.isPluginAvailable('StatusBar');
}

export async function unlockNativeScreenOrientation() {
  await ScreenOrientation.unlock();
}

export async function lockNativeScreenOrientation(orientation: Exclude<tSystemViewOrientation, 'any'>) {
  await ScreenOrientation.lock({ orientation });
}

export async function setNativeStatusBarOverlay(isWebViewLimitedByStatusBar: boolean) {
  await StatusBar.setOverlaysWebView({
    overlay: !isWebViewLimitedByStatusBar,
  });
}

export async function showNativeStatusBar() {
  await StatusBar.show();
}

export async function hideNativeStatusBar() {
  await StatusBar.hide();
}

export function unlockWebScreenOrientation() {
  screen.orientation.unlock();
}

export async function lockWebScreenOrientation(orientation: Exclude<tSystemViewOrientation, 'any'>) {
  await screen.orientation.lock(orientation);
}
