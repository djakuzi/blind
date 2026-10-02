import type { tSystemThemeMode } from '../type';

function getBrowserPreferredThemeMode(): tSystemThemeMode {
  if (typeof globalThis.matchMedia !== 'function') {
    return 'light';
  }

  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const HelperTheme = {
  getBrowserPreferredThemeMode,
};
