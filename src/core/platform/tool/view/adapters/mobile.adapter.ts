import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';
import type {
  iEnterViewFullscreenOptions,
  iViewAdapter,
  tViewOrientation,
} from '../type';

async function runSafe(action: () => Promise<void>) {
  try {
    await action();

    return true;
  } catch {
    return false;
  }
}

export const MobileViewAdapter: iViewAdapter = {
  getViewportSize() {
    return {
      value: {
        width: typeof window === 'undefined' ? 0 : window.innerWidth,
        height: typeof window === 'undefined' ? 0 : window.innerHeight,
      },
    };
  },

  async setOrientation(orientation: tViewOrientation) {
    return {
      isHandled: await runSafe(async () => {
        if (orientation === 'any') {
          await ScreenOrientation.unlock();
          return;
        }

        await ScreenOrientation.lock({
          orientation,
        });
      }),
    };
  },

  async setStatusBarVisible(value) {
    return {
      isHandled: await runSafe(async () => {
        if (value) {
          await StatusBar.show();
          return;
        }

        await StatusBar.hide();
      }),
    };
  },

  async setWebViewLimitedByStatusBar(value) {
    return {
      isHandled: await runSafe(async () => {
        await StatusBar.setOverlaysWebView({
          overlay: !value,
        });
      }),
    };
  },

  async isFullscreen() {
    return {
      value: typeof document !== 'undefined' && document.fullscreenElement !== null,
    };
  },

  async enterFullscreen(options: iEnterViewFullscreenOptions) {
    if (
      typeof document === 'undefined' ||
      typeof document.documentElement.requestFullscreen !== 'function'
    ) {
      return {
        isHandled: false,
      };
    }

    if (document.fullscreenElement !== null) {
      return {
        isHandled: true,
      };
    }

    const target = options.target ?? document.documentElement;

    return {
      isHandled: await runSafe(async () => {
        await target.requestFullscreen({
          navigationUI: options.navigation,
        });
      }),
    };
  },

  async exitFullscreen() {
    if (
      typeof document === 'undefined' ||
      typeof document.exitFullscreen !== 'function'
    ) {
      return {
        isHandled: false,
      };
    }

    if (document.fullscreenElement === null) {
      return {
        isHandled: true,
      };
    }

    return {
      isHandled: await runSafe(() => document.exitFullscreen()),
    };
  },
};
