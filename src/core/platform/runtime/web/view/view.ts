import type { iPlatformActionResult } from '../../../type';
import type {
  iEnterViewFullscreenOptions,
  iViewAdapter,
  tViewOrientation,
} from '../../../tool/view/type';

async function runSafe(action: () => Promise<void>) {
  try {
    await action();

    return true;
  } catch {
    return false;
  }
}

function unsupported(): Promise<iPlatformActionResult> {
  return Promise.resolve({
    isHandled: false,
  });
}

export const RuntimeWebView: iViewAdapter = {
  getViewportSize() {
    return {
      value: {
        width: typeof window === 'undefined' ? 0 : window.innerWidth,
        height: typeof window === 'undefined' ? 0 : window.innerHeight,
      },
    };
  },

  async setOrientation(orientation: tViewOrientation) {
    if (typeof screen === 'undefined' || !screen.orientation) {
      return {
        isHandled: false,
      };
    }

    const isHandled = await runSafe(async () => {
      if (orientation === 'any') {
        screen.orientation.unlock();
        return;
      }

      await screen.orientation.lock(orientation);
    });

    return {
      isHandled,
    };
  },

  setStatusBarVisible: unsupported,
  setWebViewLimitedByStatusBar: unsupported,

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
