import {
  DEFAULT_SCALE_VALUE,
  MAX_SCALE_VALUE,
  MIN_SCALE_VALUE,
} from './const';

export function normalizeScaleValue(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_SCALE_VALUE;
  }

  return Math.min(MAX_SCALE_VALUE, Math.max(MIN_SCALE_VALUE, value));
}

export async function runSafeAsync(action: () => Promise<void>) {
  try {
    await action();
  } catch {
    return;
  }
}

export function canUseWebScreenOrientation() {
  return typeof screen !== 'undefined' && Boolean(screen.orientation);
}
