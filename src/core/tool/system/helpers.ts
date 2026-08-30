const MIN_SCALE_VALUE = 0.5
const MAX_SCALE_VALUE = 2
const DEFAULT_SCALE_VALUE = 1

export function normalizeScaleValue(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_SCALE_VALUE
  }

  return Math.min(MAX_SCALE_VALUE, Math.max(MIN_SCALE_VALUE, value))
}
