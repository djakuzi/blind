import type { iPlatformActionResult, iPlatformValue } from '../../type';

export type tSystemThemeMode = 'light' | 'dark';
export type tSystemThemeSource = 'system' | tSystemThemeMode;

export interface iSystemScale extends iPlatformValue<number> {}

export interface iSystemAdapter {
  getLanguage(): Promise<string>;
  getScale(): Promise<number | null>;
  prefersDarkTheme(): boolean;
  setThemeSource(themeSource: tSystemThemeSource): Promise<iPlatformActionResult>;
}
