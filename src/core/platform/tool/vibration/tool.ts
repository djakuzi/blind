import { DEFAULT_VIBRATION_DURATION, DEFAULT_VIBRATION_IMPACT_STYLE, DEFAULT_VIBRATION_NOTIFICATION_TYPE } from './const';
import type { iVibrationAdapter, iVibrationImpactOptions, iVibrationNotificationOptions, iVibrationOptions } from './type';

function normalizeDuration(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_VIBRATION_DURATION;
  }

  return Math.max(1, value);
}

export function createVibrationTool(adapter: iVibrationAdapter) {
  function vibrate({ duration = DEFAULT_VIBRATION_DURATION }: iVibrationOptions = {}) {
    return adapter.vibrate(normalizeDuration(duration));
  }

  function impact({ style = DEFAULT_VIBRATION_IMPACT_STYLE }: iVibrationImpactOptions = {}) {
    return adapter.impact(style);
  }

  function notification({ type = DEFAULT_VIBRATION_NOTIFICATION_TYPE }: iVibrationNotificationOptions = {}) {
    return adapter.notification(type);
  }

  return {
    vibrate,
    impact,
    notification,
    selectionStart() {
      return adapter.selection('start');
    },
    selectionChanged() {
      return adapter.selection('changed');
    },
    selectionEnd() {
      return adapter.selection('end');
    },
  };
}
