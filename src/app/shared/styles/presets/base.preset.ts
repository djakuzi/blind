import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import type { tFontSizeValue } from '@/app/styles/contracts/fontSize.contract';
import type { tSpaceValue } from '@/app/styles/contracts/space.contract';

export const BASE_SIZE_FONT_PRESET: Record<tBaseSizeVariant, tFontSizeValue> = {
  small: 'sm',
  middle: 'md',
  big: 'lg',
};

export const BASE_SIZE_SPACE_PRESET: Record<tBaseSizeVariant, tSpaceValue> = {
  small: 2,
  middle: 3,
  big: 4,
};

export const BASE_SIZE_MEDIA_WIDTH_PRESET: Record<tBaseSizeVariant, string> = {
  small: '2rem',
  middle: '2.5rem',
  big: '3rem',
};
