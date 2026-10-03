import type { iPlatformActionResult, iPlatformValue } from '../../../type';
import type {
  iEnterViewFullscreenOptions,
  iSetupViewOptions,
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

function getViewportRatio() {
  if (typeof window === 'undefined' || window.innerHeight === 0) {
    return { value: 1 };
  }

  return { value: window.innerWidth / window.innerHeight };
}

async function setupOrientation(
  orientation: tViewOrientation,
): Promise<iPlatformActionResult> {
  if (typeof screen === 'undefined' || !screen.orientation) {
    return { isHandled: false };
  }

  const isHandled = await runSafe(async () => {
    if (orientation === 'any') {
      screen.orientation.unlock();
      return;
    }

    await screen.orientation.lock(orientation);
  });

  return { isHandled };
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
  const isHandled = await runSafe(async () => {
    await target.requestFullscreen({ navigationUI: options.navigation });
  });

  return { isHandled };
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

export const RuntimeWebView: iViewAdapter = {
  getViewportRatio,

  async setupView(options: iSetupViewOptions) {
    if (!options.orientation) {
      return { isHandled: true };
    }

    return setupOrientation(options.orientation);
  },

  isFullscreen,
  enterFullscreen,
  exitFullscreen,
};
