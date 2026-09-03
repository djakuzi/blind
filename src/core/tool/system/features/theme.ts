export function canUsePreferredThemeMode() {
  return typeof globalThis.matchMedia === 'function';
}

export function isDarkThemeModePreferred() {
  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
}
