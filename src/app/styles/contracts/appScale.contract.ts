export const APP_SCALE_MODE = {
  small: 0.9,
  default: 1,
  large: 1.1,
  xlarge: 1.2,
} as const

export type tAppScaleMode = keyof typeof APP_SCALE_MODE
