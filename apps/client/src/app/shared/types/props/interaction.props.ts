import type { tAudioId } from '@/core/media/audio';
import type { ToolAudio, ToolVibration } from '@/core/platform';

export interface PropsDisabled {
  disabled?: boolean;
}

export type tVibrationEffect =
  | { type: 'selection'; phase: ToolVibration.tVibrationSelectionPhase }
  | { type: 'impact'; style: ToolVibration.tVibrationImpactStyle }
  | { type: 'notification'; notificationType: ToolVibration.tVibrationNotificationType }
  | { type: 'vibrate'; duration: number };

export interface PropsSelectionFeedback {
  sound?: tAudioId | null;
  audioOptions?: ToolAudio.iAudioPlayOptions;
  vibration?: boolean;
  vibrationEffect?: tVibrationEffect;
}
