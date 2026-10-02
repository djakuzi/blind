import { createAdapterResolver } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopSystemAdapter } from './adapters/desktop.adapter';
import { MobileSystemAdapter } from './adapters/mobile.adapter';
import { WebSystemAdapter } from './adapters/web.adapter';
import type { iSystemAdapter, tSystemThemeMode } from './type';

export type { iSystemAdapter, iSystemScale, tSystemThemeMode } from './type';

const resolveSystemAdapter = createAdapterResolver({
  getKey: PlatformRuntime.getRuntime,
  adapters: {
    web: WebSystemAdapter,
    mobile: MobileSystemAdapter,
    desktop: DesktopSystemAdapter,
  },
});

export async function getSystemLanguage() {
  return resolveSystemAdapter().getSystemLanguage();
}

export async function getCurrentScale() {
  return resolveSystemAdapter().getCurrentScale();
}

export async function getPreferredScale() {
  return resolveSystemAdapter().getPreferredScale();
}

export async function getSystemScale() {
  return resolveSystemAdapter().getSystemScale();
}

export function getPreferredThemeMode(): tSystemThemeMode {
  return resolveSystemAdapter().getPreferredThemeMode();
}
