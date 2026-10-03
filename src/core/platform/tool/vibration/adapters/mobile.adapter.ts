import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import type { iPlatformActionResult } from '../../../type';
import type {
  iVibrationAdapter,
  tVibrationImpactStyle,
  tVibrationNotificationType,
  tVibrationSelectionPhase,
} from '../type';

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

const IMPACT_PATTERN: Record<tVibrationImpactStyle, readonly number[]> = {
  light: [20],
  medium: [35],
  heavy: [55],
};

const NOTIFICATION_PATTERN: Record<tVibrationNotificationType, readonly number[]> = {
  success: [25, 35, 25],
  warning: [35, 45, 45],
  error: [55, 45, 55],
};

const SELECTION_PATTERN: Record<tVibrationSelectionPhase, readonly number[]> = {
  start: [12],
  changed: [18],
  end: [8],
};

function vibrateBrowser(pattern: readonly number[]): iPlatformActionResult {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return {
      isHandled: false,
    };
  }

  try {
    return {
      isHandled: navigator.vibrate([...pattern]),
    };
  } catch {
    return {
      isHandled: false,
    };
  }
}

async function performNative(
  action: () => Promise<void>,
  fallbackPattern: readonly number[],
): Promise<iPlatformActionResult> {
  try {
    await action();

    return {
      isHandled: true,
    };
  } catch {
    return vibrateBrowser(fallbackPattern);
  }
}

export const MobileVibrationAdapter: iVibrationAdapter = {
  vibrate(duration) {
    return performNative(
      () => Haptics.vibrate({ duration }),
      [duration],
    );
  },

  impact(style) {
    return performNative(
      () => Haptics.impact({ style: IMPACT_STYLE_MAP[style] }),
      IMPACT_PATTERN[style],
    );
  },

  notification(type) {
    return performNative(
      () => Haptics.notification({ type: NOTIFICATION_TYPE_MAP[type] }),
      NOTIFICATION_PATTERN[type],
    );
  },

  selection(phase) {
    const action = {
      start: () => Haptics.selectionStart(),
      changed: () => Haptics.selectionChanged(),
      end: () => Haptics.selectionEnd(),
    }[phase];

    return performNative(
      action,
      SELECTION_PATTERN[phase],
    );
  },
};
