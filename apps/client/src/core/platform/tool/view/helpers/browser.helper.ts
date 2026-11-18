import type { iPlatformActionResult, iPlatformValue } from '../../../type';
import { HelperViewAction } from './action.helper';
import type { iEnterViewFullscreenOptions, iViewSize, tViewOrientation } from '../type';

function getViewportSize(): iPlatformValue<iViewSize> {
  return {
    value: {
      width: typeof window === 'undefined' ? 0 : window.innerWidth,
      height: typeof window === 'undefined' ? 0 : window.innerHeight,
    },
  };
}

async function setOrientation(orientation: tViewOrientation): Promise<iPlatformActionResult> {
  if (typeof screen === 'undefined' || !screen.orientation) {
    return {
      isHandled: false,
    };
  }

  return {
    isHandled: await HelperViewAction.runSafe(async () => {
      if (orientation === 'any') {
        screen.orientation.unlock();
        return;
      }

      await screen.orientation.lock(orientation);
    }),
  };
}

async function isFullscreen() {
  return {
    value: typeof document !== 'undefined' && document.fullscreenElement !== null,
  };
}

async function enterFullscreen(options: iEnterViewFullscreenOptions): Promise<iPlatformActionResult> {
  if (typeof document === 'undefined' || typeof document.documentElement.requestFullscreen !== 'function') {
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
    isHandled: await HelperViewAction.runSafe(async () => {
      await target.requestFullscreen({
        navigationUI: options.navigation,
      });
    }),
  };
}

async function exitFullscreen(): Promise<iPlatformActionResult> {
  if (typeof document === 'undefined' || typeof document.exitFullscreen !== 'function') {
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
    isHandled: await HelperViewAction.runSafe(() => document.exitFullscreen()),
  };
}

export const HelperBrowserView = {
  getViewportSize,
  setOrientation,
  isFullscreen,
  enterFullscreen,
  exitFullscreen,
};
