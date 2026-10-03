import type { iPlatformActionResult } from '../../type';

export type tVibrationImpactStyle = 'light' | 'medium' | 'heavy';
export type tVibrationNotificationType = 'success' | 'warning' | 'error';
export type tVibrationSelectionPhase = 'start' | 'changed' | 'end';

export interface iVibrationOptions {
  duration?: number;
}

export interface iVibrationImpactOptions {
  style?: tVibrationImpactStyle;
}

export interface iVibrationNotificationOptions {
  type?: tVibrationNotificationType;
}

export interface iGamepadRumbleOptions {
  duration: number;
  weakMagnitude: number;
  strongMagnitude: number;
}

export interface iVibrationAdapter {
  vibrate(duration: number): Promise<iPlatformActionResult>;
  impact(style: tVibrationImpactStyle): Promise<iPlatformActionResult>;
  notification(type: tVibrationNotificationType): Promise<iPlatformActionResult>;
  selection(phase: tVibrationSelectionPhase): Promise<iPlatformActionResult>;
}
