export const BASE_ADAPTIVE_VARIANTS = ['small', 'middle', 'big'] as const
export const BASE_SIZE_VARIANTS = BASE_ADAPTIVE_VARIANTS

export type BaseAdaptiveVariant = (typeof BASE_ADAPTIVE_VARIANTS)[number]
export type BaseSizeVariant = (typeof BASE_SIZE_VARIANTS)[number]
