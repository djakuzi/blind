import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import type { tFontSizeValue } from '@/app/styles/contracts/fontSize.contract';
import type { tPaddingValue } from '@/app/styles/contracts/padding.contract';

export interface iControlSizePreset {
  paddingX: tPaddingValue;
  paddingY: tPaddingValue;
  fontSize: tFontSizeValue;
}

export const CONTROL_SIZE_PRESET: Record<tBaseSizeVariant, iControlSizePreset> = {
  small: {
    paddingX: 3,
    paddingY: 2,
    fontSize: 'sm',
  },
  middle: {
    paddingX: 5,
    paddingY: 3,
    fontSize: 'md',
  },
  big: {
    paddingX: 6,
    paddingY: 4,
    fontSize: 'lg',
  },
};
