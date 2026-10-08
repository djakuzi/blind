import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { BROWSER_VIBRATION_IMPACT_PATTERN, BROWSER_VIBRATION_NOTIFICATION_PATTERN, BROWSER_VIBRATION_SELECTION_PATTERN } from '../const';
import { HelperBrowserVibration } from '../helpers/browser.helper';
import type { iVibrationAdapter, tVibrationImpactStyle, tVibrationNotificationType } from '../type';

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

async function performNative(action: () => Promise<void>, fallbackPattern: readonly number[]) {
  try {
    await action();

    return {
      isHandled: true,
    };
  } catch {
    return HelperBrowserVibration.vibrate(fallbackPattern);
  }
}

export const MobileVibrationAdapter: iVibrationAdapter = {
  vibrate(duration) {
    return performNative(() => Haptics.vibrate({ duration }), [duration]);
  },

  impact(style) {
    return performNative(() => Haptics.impact({ style: IMPACT_STYLE_MAP[style] }), BROWSER_VIBRATION_IMPACT_PATTERN[style]);
  },

  notification(type) {
    return performNative(() => Haptics.notification({ type: NOTIFICATION_TYPE_MAP[type] }), BROWSER_VIBRATION_NOTIFICATION_PATTERN[type]);
  },

  selection(phase) {
    const action = {
      start: () => Haptics.selectionStart(),
      changed: () => Haptics.selectionChanged(),
      end: () => Haptics.selectionEnd(),
    }[phase];

    return performNative(action, BROWSER_VIBRATION_SELECTION_PATTERN[phase]);
  },
};
