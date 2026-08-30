import {
  DEFAULT_SCALE_VALUE,
  MAX_SCALE_VALUE,
  MIN_SCALE_VALUE,
} from './const'

export function normalizeScaleValue(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_SCALE_VALUE
  }

  return Math.min(MAX_SCALE_VALUE, Math.max(MIN_SCALE_VALUE, value))
}
