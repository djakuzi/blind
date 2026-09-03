export type tViewOrientation = 'any' | 'landscape' | 'portrait';
export type tViewFullscreenNavigation = 'auto' | 'hide' | 'show';

export interface iEnterViewFullscreenOptions {
  target?: HTMLElement | null
  navigation?: tViewFullscreenNavigation
}

export interface iSetupViewOptions {
  orientation?: tViewOrientation
  isStatusBarVisible?: boolean
  isWebViewLimitedByStatusBar?: boolean
}
