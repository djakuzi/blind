export type tSystemThemeMode = 'light' | 'dark';

export interface iSystemScale {
  value: number;
}

export interface iSystemAdapter {
  getSystemLanguage(): Promise<string>;
  getCurrentScale(): Promise<iSystemScale>;
  getPreferredScale(): Promise<iSystemScale>;
  getSystemScale(): Promise<iSystemScale>;
  getPreferredThemeMode(): tSystemThemeMode;
}
