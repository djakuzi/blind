import type { iPlatformActionResult } from '../../../type';
import type {
  iVibrationAdapter,
  tVibrationImpactStyle,
  tVibrationNotificationType,
  tVibrationSelectionPhase,
} from '../type';

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

function vibratePattern(pattern: readonly number[]): iPlatformActionResult {
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

export const WebVibrationAdapter: iVibrationAdapter = {
  async vibrate(duration) {
    return vibratePattern([duration]);
  },

  async impact(style) {
    return vibratePattern(IMPACT_PATTERN[style]);
  },

  async notification(type) {
    return vibratePattern(NOTIFICATION_PATTERN[type]);
  },

  async selection(phase) {
    return vibratePattern(SELECTION_PATTERN[phase]);
  },
};
