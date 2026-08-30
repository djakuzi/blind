export const APP_SCALE_MODE_LIST = [
  'system',
  'small',
  'default',
  'large',
  'xlarge',
] as const

export const APP_SCALE_MODE = {
  small: 0.9,
  default: 1,
  large: 1.1,
  xlarge: 1.2,
} as const

export const APP_SCALE_SYSTEM_MODE = 'system' as const

export type tAppScalePresetMode = keyof typeof APP_SCALE_MODE

export type tAppScaleMode = (typeof APP_SCALE_MODE_LIST)[number]
