import { DEFAULT_VIBRATION_DURATION } from '../const';

function normalizeDuration(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_VIBRATION_DURATION;
  }

  return Math.max(1, value);
}

export const HelperDuration = {
  normalizeDuration,
};
