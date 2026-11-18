import type { iGamepadRumbleOptions, tVibrationImpactStyle, tVibrationNotificationType, tVibrationSelectionPhase } from './type';

export const DEFAULT_VIBRATION_DURATION = 45;
export const DEFAULT_VIBRATION_IMPACT_STYLE: tVibrationImpactStyle = 'light';
export const DEFAULT_VIBRATION_NOTIFICATION_TYPE: tVibrationNotificationType = 'success';

export const BROWSER_VIBRATION_IMPACT_PATTERN: Record<tVibrationImpactStyle, readonly number[]> = {
  light: [20],
  medium: [35],
  heavy: [55],
};

export const BROWSER_VIBRATION_NOTIFICATION_PATTERN: Record<tVibrationNotificationType, readonly number[]> = {
  success: [25, 35, 25],
  warning: [35, 45, 45],
  error: [55, 45, 55],
};

export const BROWSER_VIBRATION_SELECTION_PATTERN: Record<tVibrationSelectionPhase, readonly number[]> = {
  start: [12],
  changed: [18],
  end: [8],
};

export const GAMEPAD_VIBRATION_IMPACT: Record<tVibrationImpactStyle, iGamepadRumbleOptions> = {
  light: { duration: 35, weakMagnitude: 0.3, strongMagnitude: 0.1 },
  medium: { duration: 55, weakMagnitude: 0.55, strongMagnitude: 0.35 },
  heavy: { duration: 80, weakMagnitude: 0.75, strongMagnitude: 0.9 },
};

export const GAMEPAD_VIBRATION_NOTIFICATION: Record<tVibrationNotificationType, iGamepadRumbleOptions> = {
  success: { duration: 70, weakMagnitude: 0.45, strongMagnitude: 0.3 },
  warning: { duration: 100, weakMagnitude: 0.55, strongMagnitude: 0.65 },
  error: { duration: 140, weakMagnitude: 0.7, strongMagnitude: 1 },
};

export const GAMEPAD_VIBRATION_SELECTION: Record<tVibrationSelectionPhase, iGamepadRumbleOptions> = {
  start: { duration: 20, weakMagnitude: 0.25, strongMagnitude: 0.05 },
  changed: { duration: 28, weakMagnitude: 0.35, strongMagnitude: 0.08 },
  end: { duration: 16, weakMagnitude: 0.2, strongMagnitude: 0.04 },
};
