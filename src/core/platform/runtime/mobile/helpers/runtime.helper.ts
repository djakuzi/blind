import { Capacitor } from '@capacitor/core';

export function isMobileRuntime() {
  return Capacitor.isNativePlatform();
}
