import type { iPlatformActionResult } from '../../../type';
import type { iVibrationAdapter } from '../../../tool/vibration/type';
import {
  WEB_VIBRATION_IMPACT_PATTERN,
  WEB_VIBRATION_NOTIFICATION_PATTERN,
  WEB_VIBRATION_SELECTION_PATTERN,
} from './const';

function vibrate(pattern: readonly number[]): iPlatformActionResult {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return { isHandled: false };
  }

  try {
    return { isHandled: navigator.vibrate([...pattern]) };
  } catch {
    return { isHandled: false };
  }
}

export const RuntimeWebVibration: iVibrationAdapter = {
  async vibrate(options) {
    return vibrate([options.duration]);
  },
  async impact(options) {
    return vibrate(WEB_VIBRATION_IMPACT_PATTERN[options.style]);
  },
  async notification(options) {
    return vibrate(WEB_VIBRATION_NOTIFICATION_PATTERN[options.type]);
  },
  async selectionStart() {
    return vibrate(WEB_VIBRATION_SELECTION_PATTERN.start);
  },
  async selectionChanged() {
    return vibrate(WEB_VIBRATION_SELECTION_PATTERN.changed);
  },
  async selectionEnd() {
    return vibrate(WEB_VIBRATION_SELECTION_PATTERN.end);
  },
};
