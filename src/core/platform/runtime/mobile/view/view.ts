import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';
import type { iPlatformActionResult, iPlatformValue } from '../../../type';
import type {
  iEnterViewFullscreenOptions,
  iViewAdapter,
} from '../../../tool/view/type';

async function runSafe(action: () => Promise<void>) {
  try {
    await action();
    return true;
  } catch {
    return false;
  }
}

function getViewportRatio() {
  if (typeof window === 'undefined' || window.innerHeight === 0) {
    return { value: 1 };
  }

  return { value: window.innerWidth / window.innerHeight };
}

async function isFullscreen(): Promise<iPlatformValue<boolean>> {
  return {
    value: typeof document !== 'undefined' && document.fullscreenElement !== null,
  };
}

async function enterFullscreen(
  options: iEnterViewFullscreenOptions,
): Promise<iPlatformActionResult> {
  if (
    typeof document === 'undefined' ||
    typeof document.documentElement.requestFullscreen !== 'function' ||
    typeof document.exitFullscreen !== 'function'
  ) {
    return { isHandled: false };
  }

  if (document.fullscreenElement !== null) {
    return { isHandled: true };
  }

  const target = options.target ?? document.documentElement;
  return {
    isHandled: await runSafe(async () => {
      await target.requestFullscreen({ navigationUI: options.navigation });
    }),
  };
}

async function exitFullscreen(): Promise<iPlatformActionResult> {
  if (
    typeof document === 'undefined' ||
    typeof document.documentElement.requestFullscreen !== 'function' ||
    typeof document.exitFullscreen !== 'function'
  ) {
    return { isHandled: false };
  }

  if (document.fullscreenElement === null) {
    return { isHandled: true };
  }

  return { isHandled: await runSafe(() => document.exitFullscreen()) };
}

export const RuntimeMobileView: iViewAdapter = {
  getViewportRatio,

  async setupView(options) {
    let isHandled = true;
    const orientation = options.orientation;

    if (orientation) {
      const orientationHandled = await runSafe(async () => {
        if (orientation === 'any') {
          await ScreenOrientation.unlock();
          return;
        }

        await ScreenOrientation.lock({ orientation });
      });

      isHandled = orientationHandled && isHandled;
    }

    if (typeof options.isWebViewLimitedByStatusBar === 'boolean') {
      const overlayHandled = await runSafe(async () => {
        await StatusBar.setOverlaysWebView({
          overlay: !options.isWebViewLimitedByStatusBar,
        });
      });

      isHandled = overlayHandled && isHandled;
    }

    if (typeof options.isStatusBarVisible === 'boolean') {
      const visibilityHandled = await runSafe(async () => {
        if (options.isStatusBarVisible) {
          await StatusBar.show();
          return;
        }

        await StatusBar.hide();
      });

      isHandled = visibilityHandled && isHandled;
    }

    return { isHandled };
  },

  isFullscreen,
  enterFullscreen,
  exitFullscreen,
};
