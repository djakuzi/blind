import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopViewAdapter } from './adapters/desktop.adapter';
import { MobileViewAdapter } from './adapters/mobile.adapter';
import { WebViewAdapter } from './adapters/web.adapter';
import type { iEnterViewFullscreenOptions } from './type';

export type {
  iEnterViewFullscreenOptions,
  iSetupViewOptions,
  iViewActionResult,
  iViewAdapter,
  iViewValue,
  tViewFullscreenNavigation,
  tViewOrientation,
} from './type';

const ViewAdapter = resolveAdapter(
  {
    web: WebViewAdapter,
    mobile: MobileViewAdapter,
    desktop: DesktopViewAdapter,
  },
  PlatformRuntime.getRuntime(),
);

export function getViewportRatio() {
  if (typeof window === 'undefined' || window.innerHeight === 0) {
    return {
      value: 1,
    };
  }

  return {
    value: window.innerWidth / window.innerHeight,
  };
}

export const {
  setupView,
  isFullscreen,
  exitFullscreen,
} = ViewAdapter;

export function enterFullscreen(options: iEnterViewFullscreenOptions = {}) {
  return ViewAdapter.enterFullscreen(options);
}

export async function toggleFullscreen(options: iEnterViewFullscreenOptions = {}) {
  const { value: fullscreen } = await isFullscreen();

  if (fullscreen) {
    return exitFullscreen();
  }

  return enterFullscreen(options);
}
