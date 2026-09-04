import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import type {
  iVibrationImpactOptions,
  iVibrationNotificationOptions,
  iVibrationOptions,
} from './type';

const DEFAULT_VIBRATION_DURATION = 45;
const DEFAULT_IMPACT_STYLE = ImpactStyle.Light;
const DEFAULT_NOTIFICATION_TYPE = NotificationType.Success;

const WEB_IMPACT_PATTERN: Record<ImpactStyle, number[]> = {
  [ImpactStyle.Light]: [20],
  [ImpactStyle.Medium]: [35],
  [ImpactStyle.Heavy]: [55],
};

const WEB_NOTIFICATION_PATTERN: Record<NotificationType, number[]> = {
  [NotificationType.Success]: [25, 35, 25],
  [NotificationType.Warning]: [35, 45, 45],
  [NotificationType.Error]: [55, 45, 55],
};

const WEB_SELECTION_PATTERN = {
  start: [12],
  changed: [18],
  end: [8],
} as const;

type tSelectionPattern = keyof typeof WEB_SELECTION_PATTERN;

function normalizeDuration(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_VIBRATION_DURATION;
  }

  return Math.max(1, value);
}

function getNavigatorVibrate() {
  return globalThis.navigator?.vibrate;
}

function vibrateBrowser(pattern: readonly number[]) {
  const vibrate = getNavigatorVibrate();

  if (typeof vibrate !== 'function') {
    return false;
  }

  try {
    return vibrate.call(globalThis.navigator, pattern);
  } catch {
    return false;
  }
}

async function selectionByPattern(
  pattern: tSelectionPattern,
  callback: () => Promise<void>,
) {
  if (Capacitor.isNativePlatform()) {
    try {
      await callback();
      return true;
    } catch {
      return vibrateBrowser(WEB_SELECTION_PATTERN[pattern]);
    }
  }

  return vibrateBrowser(WEB_SELECTION_PATTERN[pattern]);
}

export async function vibrate(options: iVibrationOptions = {}) {
  const duration = normalizeDuration(options.duration ?? DEFAULT_VIBRATION_DURATION);

  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.vibrate({ duration });
      return true;
    } catch {
      return vibrateBrowser([duration]);
    }
  }

  return vibrateBrowser([duration]);
}

export async function impact(options: iVibrationImpactOptions = {}) {
  const style = options.style ?? DEFAULT_IMPACT_STYLE;

  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.impact({ style });
      return true;
    } catch {
      return vibrateBrowser(WEB_IMPACT_PATTERN[style]);
    }
  }

  return vibrateBrowser(WEB_IMPACT_PATTERN[style]);
}

export async function notification(options: iVibrationNotificationOptions = {}) {
  const type = options.type ?? DEFAULT_NOTIFICATION_TYPE;

  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.notification({ type });
      return true;
    } catch {
      return vibrateBrowser(WEB_NOTIFICATION_PATTERN[type]);
    }
  }

  return vibrateBrowser(WEB_NOTIFICATION_PATTERN[type]);
}

export async function selectionStart() {
  return selectionByPattern('start', () => Haptics.selectionStart());
}

export async function selectionChanged() {
  return selectionByPattern('changed', () => Haptics.selectionChanged());
}

export async function selectionEnd() {
  return selectionByPattern('end', () => Haptics.selectionEnd());
}
