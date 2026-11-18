import type { PropsSelectionFeedback, tVibrationEffect } from '@/app/shared/types/props/interaction.props';
import { useAudio } from '@/app/shared/composables/audio/useAudio';
import { ToolVibration } from '@/core/platform';

export function useSelectionFeedback(props: PropsSelectionFeedback) {
  const { play } = useAudio();

  function triggerSelectionFeedback() {
    if (props.sound != null) {
      play(props.sound, props.audioOptions);
    }

    if (!props.vibration) {
      return;
    }

    const effect: tVibrationEffect = props.vibrationEffect ?? { type: 'selection', phase: 'changed' };

    switch (effect.type) {
      case 'selection':
        switch (effect.phase) {
          case 'start':
            ToolVibration.selectionStart();
            break;
          case 'changed':
            ToolVibration.selectionChanged();
            break;
          case 'end':
            ToolVibration.selectionEnd();
            break;
        }
        break;
      case 'impact':
        ToolVibration.impact({ style: effect.style });
        break;
      case 'notification':
        ToolVibration.notification({ type: effect.notificationType });
        break;
      case 'vibrate':
        ToolVibration.vibrate({ duration: effect.duration });
        break;
    }
  }

  return { triggerSelectionFeedback };
}
