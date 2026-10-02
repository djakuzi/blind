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

export interface iVibrationAdapter {
  vibrate(options: Required<iVibrationOptions>): Promise<iPlatformActionResult>;
  impact(options: Required<iVibrationImpactOptions>): Promise<iPlatformActionResult>;
  notification(options: Required<iVibrationNotificationOptions>): Promise<iPlatformActionResult>;
  selectionStart(): Promise<iPlatformActionResult>;
  selectionChanged(): Promise<iPlatformActionResult>;
  selectionEnd(): Promise<iPlatformActionResult>;
}
