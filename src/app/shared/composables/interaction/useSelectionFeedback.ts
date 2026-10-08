import type { PropsSelectionFeedback } from '@/app/shared/types/props/interaction.props';
import { useAudio } from '@/app/shared/composables/audio/useAudio';
import { ToolVibration } from '@/core/platform';

export function useSelectionFeedback(props: PropsSelectionFeedback) {
  const { play } = useAudio();

  function triggerSelectionFeedback() {
    if (props.sound != null) {
      play(props.sound);
    }

    if (props.vibration) {
      ToolVibration.selectionChanged();
    }
  }

  return { triggerSelectionFeedback };
}
