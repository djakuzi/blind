import { HelperAction } from './action.helper';
import type {
  iEnterViewFullscreenOptions,
  iViewActionResult,
  iViewValue,
  tViewOrientation,
} from '../type';

function canUseFullscreen() {
  return (
    typeof document !== 'undefined' &&
    typeof document.documentElement.requestFullscreen === 'function' &&
    typeof document.exitFullscreen === 'function'
  );
}

function canUseScreenOrientation() {
  return typeof screen !== 'undefined' && Boolean(screen.orientation);
}

async function setupOrientation(orientation: tViewOrientation): Promise<iViewActionResult> {
  if (!canUseScreenOrientation()) {
    return {
      isHandled: false,
    };
  }

  const isHandled = await HelperAction.runSafe(async () => {
    if (orientation === 'any') {
      screen.orientation.unlock();

      return;
    }

    await screen.orientation.lock(orientation);
  });

  return {
    isHandled,
  };
}

async function isFullscreen(): Promise<iViewValue<boolean>> {
  return {
    value: typeof document !== 'undefined' && document.fullscreenElement !== null,
  };
}

async function enterFullscreen(options: iEnterViewFullscreenOptions): Promise<iViewActionResult> {
  if (!canUseFullscreen()) {
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
  const isHandled = await HelperAction.runSafe(async () => {
    await target.requestFullscreen({
      navigationUI: options.navigation,
    });
  });

  return {
    isHandled,
  };
}

async function exitFullscreen(): Promise<iViewActionResult> {
  if (!canUseFullscreen()) {
    return {
      isHandled: false,
    };
  }

  if (document.fullscreenElement === null) {
    return {
      isHandled: true,
    };
  }

  const isHandled = await HelperAction.runSafe(async () => {
    await document.exitFullscreen();
  });

  return {
    isHandled,
  };
}

export const HelperBrowserView = {
  setupOrientation,
  isFullscreen,
  enterFullscreen,
  exitFullscreen,
};
