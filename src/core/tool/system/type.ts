export type tSystemThemeMode = 'light' | 'dark';
export type tSystemViewOrientation = 'any' | 'landscape' | 'portrait';

export interface iSetupSystemViewOptions {
  orientation?: tSystemViewOrientation
  isStatusBarVisible?: boolean
  isWebViewLimitedByStatusBar?: boolean
}
