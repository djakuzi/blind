import type {
  tVibrationImpactStyle,
  tVibrationNotificationType,
  tVibrationSelectionPhase,
} from '../../../tool/vibration/type';

export const WEB_VIBRATION_IMPACT_PATTERN: Record<tVibrationImpactStyle, readonly number[]> = {
  light: [20],
  medium: [35],
  heavy: [55],
};

export const WEB_VIBRATION_NOTIFICATION_PATTERN: Record<tVibrationNotificationType, readonly number[]> = {
  success: [25, 35, 25],
  warning: [35, 45, 45],
  error: [55, 45, 55],
};

export const WEB_VIBRATION_SELECTION_PATTERN: Record<tVibrationSelectionPhase, readonly number[]> = {
  start: [12],
  changed: [18],
  end: [8],
};
