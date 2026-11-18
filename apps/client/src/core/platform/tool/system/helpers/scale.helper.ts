import { DEFAULT_SCALE_VALUE, MAX_SCALE_VALUE, MIN_SCALE_VALUE } from '../const';

function normalizeScaleValue(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_SCALE_VALUE;
  }

  return Math.min(MAX_SCALE_VALUE, Math.max(MIN_SCALE_VALUE, value));
}

function getDefaultScale() {
  return {
    value: DEFAULT_SCALE_VALUE,
  };
}

export const HelperScale = {
  normalizeScaleValue,
  getDefaultScale,
};
