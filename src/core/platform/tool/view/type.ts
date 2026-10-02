export type tViewOrientation = 'any' | 'landscape' | 'portrait';
export type tViewFullscreenNavigation = 'auto' | 'hide' | 'show';

export interface iViewValue<T> {
  value: T;
}

export interface iViewActionResult {
  isHandled: boolean;
}

export interface iEnterViewFullscreenOptions {
  target?: HTMLElement | null;
  navigation?: tViewFullscreenNavigation;
}

export interface iSetupViewOptions {
  orientation?: tViewOrientation;
  isStatusBarVisible?: boolean;
  isWebViewLimitedByStatusBar?: boolean;
}

export interface iViewAdapter {
  setupView(options: iSetupViewOptions): Promise<iViewActionResult>;
  isFullscreen(): Promise<iViewValue<boolean>>;
  enterFullscreen(options: iEnterViewFullscreenOptions): Promise<iViewActionResult>;
  exitFullscreen(): Promise<iViewActionResult>;
}
