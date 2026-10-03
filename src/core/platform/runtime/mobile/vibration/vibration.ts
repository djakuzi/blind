import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import type { iPlatformActionResult } from '../../../type';
import type {
  iVibrationAdapter,
  tVibrationImpactStyle,
  tVibrationNotificationType,
} from '../../../tool/vibration/type';
import {
  MOBILE_VIBRATION_IMPACT_PATTERN,
  MOBILE_VIBRATION_NOTIFICATION_PATTERN,
  MOBILE_VIBRATION_SELECTION_PATTERN,
} from './const';

const IMPACT_STYLE_MAP: Record<tVibrationImpactStyle, ImpactStyle> = {
  light: ImpactStyle.Light,
  medium: ImpactStyle.Medium,
  heavy: ImpactStyle.Heavy,
};

const NOTIFICATION_TYPE_MAP: Record<tVibrationNotificationType, NotificationType> = {
  success: NotificationType.Success,
  warning: NotificationType.Warning,
  error: NotificationType.Error,
};

function vibrateBrowser(pattern: readonly number[]): iPlatformActionResult {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return { isHandled: false };
  }

  try {
    return { isHandled: navigator.vibrate([...pattern]) };
  } catch {
    return { isHandled: false };
  }
}

async function performNative(
  action: () => Promise<void>,
  fallbackPattern: readonly number[],
): Promise<iPlatformActionResult> {
  try {
    await action();
    return { isHandled: true };
  } catch {
    return vibrateBrowser(fallbackPattern);
  }
}

export const RuntimeMobileVibration: iVibrationAdapter = {
  vibrate(options) {
    return performNative(() => Haptics.vibrate({ duration: options.duration }), [options.duration]);
  },
  impact(options) {
    return performNative(
      () => Haptics.impact({ style: IMPACT_STYLE_MAP[options.style] }),
      MOBILE_VIBRATION_IMPACT_PATTERN[options.style],
    );
  },
  notification(options) {
    return performNative(
      () => Haptics.notification({ type: NOTIFICATION_TYPE_MAP[options.type] }),
      MOBILE_VIBRATION_NOTIFICATION_PATTERN[options.type],
    );
  },
  selectionStart() {
    return performNative(() => Haptics.selectionStart(), MOBILE_VIBRATION_SELECTION_PATTERN.start);
  },
  selectionChanged() {
    return performNative(() => Haptics.selectionChanged(), MOBILE_VIBRATION_SELECTION_PATTERN.changed);
  },
  selectionEnd() {
    return performNative(() => Haptics.selectionEnd(), MOBILE_VIBRATION_SELECTION_PATTERN.end);
  },
};
