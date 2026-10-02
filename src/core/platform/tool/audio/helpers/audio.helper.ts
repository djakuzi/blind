import { DEFAULT_AUDIO_CHANNELS, DEFAULT_AUDIO_VOLUME } from '../const';

function normalizeChannels(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return DEFAULT_AUDIO_CHANNELS;
  }

  return Math.max(1, Math.floor(value));
}

function normalizeVolume(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return DEFAULT_AUDIO_VOLUME;
  }

  return Math.min(1, Math.max(0, value));
}

function normalizeTime(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

function createHandledResult() {
  return {
    isHandled: true,
  };
}

export const HelperAudio = {
  normalizeChannels,
  normalizeVolume,
  normalizeTime,
  createHandledResult,
};
