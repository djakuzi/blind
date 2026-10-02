import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import {
  WEB_VIBRATION_IMPACT_PATTERN,
  WEB_VIBRATION_NOTIFICATION_PATTERN,
  WEB_VIBRATION_SELECTION_PATTERN,
} from '../const';
import { HelperBrowserVibration } from '../helpers/browser.helper';
import type {
  iVibrationAdapter,
  iVibrationResult,
  tVibrationImpactStyle,
  tVibrationNotificationType,
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

async function performNative(action: () => Promise<void>, fallbackPattern: readonly number[]): Promise<iVibrationResult> {
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
  vibrate(options) {
    return performNative(
      () => Haptics.vibrate({ duration: options.duration }),
      [options.duration],
    );
  },

  impact(options) {
    return performNative(
      () => Haptics.impact({ style: IMPACT_STYLE_MAP[options.style] }),
      WEB_VIBRATION_IMPACT_PATTERN[options.style],
    );
  },

  notification(options) {
    return performNative(
      () => Haptics.notification({ type: NOTIFICATION_TYPE_MAP[options.type] }),
      WEB_VIBRATION_NOTIFICATION_PATTERN[options.type],
    );
  },

  selectionStart() {
    return performNative(
      () => Haptics.selectionStart(),
      WEB_VIBRATION_SELECTION_PATTERN.start,
    );
  },

  selectionChanged() {
    return performNative(
      () => Haptics.selectionChanged(),
      WEB_VIBRATION_SELECTION_PATTERN.changed,
    );
  },

  selectionEnd() {
    return performNative(
      () => Haptics.selectionEnd(),
      WEB_VIBRATION_SELECTION_PATTERN.end,
    );
  },
};
