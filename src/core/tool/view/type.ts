export type tViewOrientation = 'any' | 'landscape' | 'portrait';

export interface iSetupViewOptions {
  orientation?: tViewOrientation
  isStatusBarVisible?: boolean
  isWebViewLimitedByStatusBar?: boolean
}
