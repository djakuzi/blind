export type tVibrationImpactStyle = 'light' | 'medium' | 'heavy';
export type tVibrationNotificationType = 'success' | 'warning' | 'error';
export type tVibrationSelectionPhase = 'start' | 'changed' | 'end';

export interface iVibrationResult {
  isPerformed: boolean;
}

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
  vibrate(options: Required<iVibrationOptions>): Promise<iVibrationResult>;
  impact(options: Required<iVibrationImpactOptions>): Promise<iVibrationResult>;
  notification(options: Required<iVibrationNotificationOptions>): Promise<iVibrationResult>;
  selectionStart(): Promise<iVibrationResult>;
  selectionChanged(): Promise<iVibrationResult>;
  selectionEnd(): Promise<iVibrationResult>;
}
