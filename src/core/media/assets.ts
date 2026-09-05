import BackArrowDark from '@/assets/icons/back/back-arrow-dark.svg?raw'
import BackArrowLight from '@/assets/icons/back/back-arrow-light.svg?raw'
import BlindDark from '@/assets/icons/logo/blind-dark.svg?raw'
import BlindLight from '@/assets/icons/logo/blind-light.svg?raw'
import BlindTextBottomDark from '@/assets/icons/logo/blind-text-bottom-dark.svg?raw'
import BlindTextBottomLight from '@/assets/icons/logo/blind-text-bottom-light.svg?raw'
import BlindTextRightDark from '@/assets/icons/logo/blind-text-right-dark.svg?raw'
import BlindTextRightLight from '@/assets/icons/logo/blind-text-right-light.svg?raw'

export const ICONS_ASSETS = {
  back: {
    backArrowDark: BackArrowDark,
    backArrowLight: BackArrowLight,
  },
  logo: {
    blindDark: BlindDark,
    blindLight: BlindLight,
    blindTextBottomDark: BlindTextBottomDark,
    blindTextBottomLight: BlindTextBottomLight,
    blindTextRightDark: BlindTextRightDark,
    blindTextRightLight: BlindTextRightLight,
  },
} as const

export type tIconGroup = keyof typeof ICONS_ASSETS
export type tIconAssets = Record<string, string>

type tResolveIconName<TName extends string> =
  TName extends `${infer TIconName}Dark`
    ? TIconName
    : TName extends `${infer TIconName}Light`
      ? TIconName
      : TName

export type tIconName<TGroup extends tIconGroup> =
  TGroup extends tIconGroup
    ? tResolveIconName<Extract<keyof (typeof ICONS_ASSETS)[TGroup], string>>
    : never
