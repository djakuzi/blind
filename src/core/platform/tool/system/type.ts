import type { iPlatformValue } from '../../type';

export type tSystemThemeMode = 'light' | 'dark';

export interface iSystemScale extends iPlatformValue<number> {}

export interface iSystemAdapter {
  getLanguage(): Promise<string>;
  getScale(): Promise<number | null>;
  prefersDarkTheme(): boolean;
}
