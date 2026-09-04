import type { ImpactStyle, NotificationType } from '@capacitor/haptics';

export interface iVibrationOptions {
  duration?: number
}

export interface iVibrationImpactOptions {
  style?: ImpactStyle
}

export interface iVibrationNotificationOptions {
  type?: NotificationType
}
