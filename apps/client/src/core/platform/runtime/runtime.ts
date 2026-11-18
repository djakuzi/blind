import { HelperPlatform as HelperDesktopPlatform } from './desktop/helpers/platform.helper';
import { HelperRuntime as HelperDesktopRuntime } from './desktop/helpers/runtime.helper';
import { HelperPlatform as HelperMobilePlatform } from './mobile/helpers/platform.helper';
import { HelperRuntime as HelperMobileRuntime } from './mobile/helpers/runtime.helper';
import type { tAppPlatform, tAppRuntime } from './type';
import { HelperPlatform as HelperWebPlatform } from './web/helpers/platform.helper';

export function getRuntime(): tAppRuntime {
  if (HelperDesktopRuntime.isDesktopRuntime()) {
    return 'desktop';
  }

  if (HelperMobileRuntime.isMobileRuntime()) {
    return 'mobile';
  }

  return 'web';
}

export function getPlatform(): tAppPlatform {
  const runtime = getRuntime();

  if (runtime === 'desktop') {
    return HelperDesktopPlatform.getDesktopPlatform();
  }

  if (runtime === 'mobile') {
    return HelperMobilePlatform.getMobilePlatform();
  }

  return HelperWebPlatform.getWebPlatform();
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
