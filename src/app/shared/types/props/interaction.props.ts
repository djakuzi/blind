import type { tAudioId } from '@/core/media/audio';

export interface PropsDisabled {
  disabled?: boolean;
}

export interface PropsSelectionFeedback {
  sound?: tAudioId | null;
  vibration?: boolean;
}
