import { Capacitor } from '@capacitor/core';

function isMobileRuntime() {
  return Capacitor.isNativePlatform();
}

export const HelperRuntime = {
  isMobileRuntime,
};
