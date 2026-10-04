function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeChannels(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function normalizeVolume(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return 1;
  }

  return clamp(value, 0, 1);
}

function normalizeNativeVolume(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return 1;
  }

  return clamp(value, 0.1, 1);
}

function normalizeTime(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

export const HelperAudio = {
  normalizeChannels,
  normalizeVolume,
  normalizeNativeVolume,
  normalizeTime,
};
