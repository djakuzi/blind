export type {
  iSetupSystemViewOptions,
  tSystemThemeMode,
  tSystemViewOrientation,
} from './type';
import { DEFAULT_SCALE_VALUE } from './const';
import * as platformFeature from './features/platform';
import * as scaleFeature from './features/scale';
import * as themeFeature from './features/theme';
import * as viewFeature from './features/view';
import * as viewportFeature from './features/viewport';
import * as helpers from './helpers';
import type {
  iSetupSystemViewOptions,
  tSystemThemeMode,
} from './type';

export function getPlatform() {
  return platformFeature.getPlatform();
}

export function isNativePlatform() {
  return platformFeature.isNativePlatform();
}

export async function getCurrentScale() {
  if (!isNativePlatform() || !scaleFeature.canUseTextZoom()) {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }

  try {
    const { value } = await scaleFeature.getCurrentTextZoomValue();
    return {
      value: helpers.normalizeScaleValue(value),
    };
  } catch {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }
}

export async function getPreferredScale() {
  if (!isNativePlatform() || !scaleFeature.canUseTextZoom()) {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }

  try {
    const { value } = await scaleFeature.getPreferredTextZoomValue();
    return {
      value: helpers.normalizeScaleValue(value),
    };
  } catch {
    return {
      value: DEFAULT_SCALE_VALUE,
    };
  }
}

export async function getSystemScale() {
  return getPreferredScale();
}

export function getPreferredThemeMode(): tSystemThemeMode {
  if (!themeFeature.canUsePreferredThemeMode()) {
    return 'light';
  }

  return themeFeature.isDarkThemeModePreferred()
    ? 'dark'
    : 'light';
}

export function getViewportRatio() {
  return viewportFeature.getViewportRatio();
}

export async function setupView(options: iSetupSystemViewOptions) {
  if (isNativePlatform()) {
    const orientation = options.orientation;

    if (orientation && viewFeature.canUseNativeScreenOrientation()) {
      await helpers.runSafeAsync(async () => {
        if (orientation === 'any') {
          await viewFeature.unlockNativeScreenOrientation();

          return;
        }

        await viewFeature.lockNativeScreenOrientation(orientation);
      });
    }

    if (viewFeature.canUseNativeStatusBar()) {
      await helpers.runSafeAsync(async () => {
        if (typeof options.isWebViewLimitedByStatusBar === 'boolean') {
          await viewFeature.setNativeStatusBarOverlay(options.isWebViewLimitedByStatusBar);
        }

        if (typeof options.isStatusBarVisible !== 'boolean') {
          return;
        }

        if (options.isStatusBarVisible) {
          await viewFeature.showNativeStatusBar();

          return;
        }

        await viewFeature.hideNativeStatusBar();
      });
    }

    return;
  }

  const orientation = options.orientation;

  if (!orientation || !helpers.canUseWebScreenOrientation()) {
    return;
  }

  await helpers.runSafeAsync(async () => {
    if (orientation === 'any') {
      viewFeature.unlockWebScreenOrientation();

      return;
    }

    await viewFeature.lockWebScreenOrientation(orientation);
  });
}
