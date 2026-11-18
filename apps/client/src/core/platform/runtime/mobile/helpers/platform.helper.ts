import { Capacitor } from '@capacitor/core';
import type { tMobileAppPlatform } from '../../type';

function getMobilePlatform(): tMobileAppPlatform {
  const platform = Capacitor.getPlatform();

  if (platform === 'android' || platform === 'ios') {
    return platform;
  }

  throw new Error(`Unsupported mobile platform: ${platform}`);
}

export const HelperPlatform = {
  getMobilePlatform,
};
