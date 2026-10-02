export type tSystemThemeMode = 'light' | 'dark';

export interface iSystemScale {
  value: number;
}

export interface iSystemAdapter {
  getSystemLanguage(): Promise<string>;
  getSystemScale(): Promise<iSystemScale>;
  getPreferredThemeMode(): tSystemThemeMode;
}
