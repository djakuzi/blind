import type { iPlatformActionResult, iPlatformValue } from '../../type';

export type tViewOrientation = 'any' | 'landscape' | 'portrait';
export type tViewFullscreenNavigation = 'auto' | 'hide' | 'show';

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
  getViewportRatio(): iPlatformValue<number>;
  setupView(options: iSetupViewOptions): Promise<iPlatformActionResult>;
  isFullscreen(): Promise<iPlatformValue<boolean>>;
  enterFullscreen(options: iEnterViewFullscreenOptions): Promise<iPlatformActionResult>;
  exitFullscreen(): Promise<iPlatformActionResult>;
}
