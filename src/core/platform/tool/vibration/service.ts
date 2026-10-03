import {
  DEFAULT_VIBRATION_DURATION,
  DEFAULT_VIBRATION_IMPACT_STYLE,
  DEFAULT_VIBRATION_NOTIFICATION_TYPE,
} from './const';
import { HelperDuration } from './helpers/duration.helper';
import type {
  iVibrationAdapter,
  iVibrationImpactOptions,
  iVibrationNotificationOptions,
  iVibrationOptions,
} from './type';

export function createVibrationService(adapter: iVibrationAdapter) {
  function vibrate({
    duration = DEFAULT_VIBRATION_DURATION,
  }: iVibrationOptions = {}) {
    return adapter.vibrate({
      duration: HelperDuration.normalizeDuration(duration),
    });
  }

  function impact({
    style = DEFAULT_VIBRATION_IMPACT_STYLE,
  }: iVibrationImpactOptions = {}) {
    return adapter.impact({
      style,
    });
  }

  function notification({
    type = DEFAULT_VIBRATION_NOTIFICATION_TYPE,
  }: iVibrationNotificationOptions = {}) {
    return adapter.notification({
      type,
    });
  }

  return {
    vibrate,
    impact,
    notification,
    selectionStart: adapter.selectionStart,
    selectionChanged: adapter.selectionChanged,
    selectionEnd: adapter.selectionEnd,
  };
}
