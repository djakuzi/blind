export const APP_THEME_MODE_LIST = [
  'system',
  'light',
  'dark',
] as const;

export const APP_THEME_ATTRIBUTE_NAME = 'data-theme';
export const APP_THEME_SYSTEM_MODE = 'system' as const;

export type tAppThemeMode = (typeof APP_THEME_MODE_LIST)[number];

export function isAppThemeMode(value: string): value is tAppThemeMode {
  return APP_THEME_MODE_LIST.includes(value as tAppThemeMode);
}
