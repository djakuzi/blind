import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import type { iPlatformActionResult } from '../../../type';
import type {
  iVibrationAdapter,
  tVibrationImpactStyle,
  tVibrationNotificationType,
  tVibrationSelectionPhase,
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
  vibrate(duration) {
    return performNative(
      () => Haptics.vibrate({ duration }),
      [duration],
    );
  },

  impact(style) {
    return performNative(
      () => Haptics.impact({ style: IMPACT_STYLE_MAP[style] }),
      MOBILE_VIBRATION_IMPACT_PATTERN[style],
    );
  },

  notification(type) {
    return performNative(
      () => Haptics.notification({ type: NOTIFICATION_TYPE_MAP[type] }),
      MOBILE_VIBRATION_NOTIFICATION_PATTERN[type],
    );
  },

  selection(phase: tVibrationSelectionPhase) {
    const action = {
      start: () => Haptics.selectionStart(),
      changed: () => Haptics.selectionChanged(),
      end: () => Haptics.selectionEnd(),
    }[phase];

    return performNative(
      action,
      MOBILE_VIBRATION_SELECTION_PATTERN[phase],
    );
  },
};
