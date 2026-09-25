function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clampFinite(value: number, min: number, max: number, fallback = min): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return clamp(value, min, max);
}

export const moduleClamp = {
  clamp,
  clampFinite,
};
