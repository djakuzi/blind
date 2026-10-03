import type { iPlatformActionResult } from '../../../type';
import type {
  iVibrationAdapter,
  tVibrationImpactStyle,
  tVibrationNotificationType,
  tVibrationSelectionPhase,
} from '../../../tool/vibration/type';
import {
  WEB_VIBRATION_IMPACT_PATTERN,
  WEB_VIBRATION_NOTIFICATION_PATTERN,
  WEB_VIBRATION_SELECTION_PATTERN,
} from './const';

function vibratePattern(pattern: readonly number[]): iPlatformActionResult {
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
  async vibrate(duration: number) {
    return vibratePattern([duration]);
  },

  async impact(style: tVibrationImpactStyle) {
    return vibratePattern(WEB_VIBRATION_IMPACT_PATTERN[style]);
  },

  async notification(type: tVibrationNotificationType) {
    return vibratePattern(WEB_VIBRATION_NOTIFICATION_PATTERN[type]);
  },

  async selection(phase: tVibrationSelectionPhase) {
    return vibratePattern(WEB_VIBRATION_SELECTION_PATTERN[phase]);
  },
};
