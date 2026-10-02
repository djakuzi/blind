import { Capacitor } from '@capacitor/core';
import type { iBlindBridge, tAppPlatform, tAppRuntime } from './type';

function getElectronBridge(): iBlindBridge | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.blind;
}

export function getRuntime(): tAppRuntime {
  if (getElectronBridge()?.runtime.runtime === 'electron') {
    return 'electron';
  }

  if (Capacitor.isNativePlatform()) {
    return 'capacitor';
  }

  return 'web';
}

export function getPlatform(): tAppPlatform {
  const electronBridge = getElectronBridge();

  if (electronBridge) {
    return electronBridge.runtime.platform;
  }

  if (Capacitor.isNativePlatform()) {
    const platform = Capacitor.getPlatform();

    if (platform === 'android' || platform === 'ios') {
      return platform;
    }
  }

  return 'web';
}

export function isWeb() {
  return getRuntime() === 'web';
}

export function isCapacitor() {
  return getRuntime() === 'capacitor';
}

export function isElectron() {
  return getRuntime() === 'electron';
}
