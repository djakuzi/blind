import type { iPlatformValue } from '../../type';

export type tSystemThemeMode = 'light' | 'dark';

export interface iSystemScale extends iPlatformValue<number> {}

export interface iSystemAdapter {
  getSystemLanguage(): Promise<string>;
  getSystemScale(): Promise<iSystemScale>;
  getPreferredThemeMode(): tSystemThemeMode;
}
