import { getDesktopPlatform, isDesktopRuntime } from './desktop';
import { getMobilePlatform, isMobileRuntime } from './mobile';
import type { tAppPlatform, tAppRuntime } from './type';
import { getWebPlatform } from './web';

export function getRuntime(): tAppRuntime {
  if (isDesktopRuntime()) {
    return 'desktop';
  }

  if (isMobileRuntime()) {
    return 'mobile';
  }

  return 'web';
}

export function getPlatform(): tAppPlatform {
  const runtime = getRuntime();

  if (runtime === 'desktop') {
    return getDesktopPlatform();
  }

  if (runtime === 'mobile') {
    return getMobilePlatform();
  }

  return getWebPlatform();
}

export function isWeb() {
  return getRuntime() === 'web';
}

export function isMobile() {
  return getRuntime() === 'mobile';
}

export function isDesktop() {
  return getRuntime() === 'desktop';
}
