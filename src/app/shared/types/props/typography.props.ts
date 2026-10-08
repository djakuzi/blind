import type { tColorValue } from '@/app/styles/contracts/color.contract';
import type { tFontSizeValue } from '@/app/styles/contracts/fontSize.contract';
import type { tFontWeightValue } from '@/app/styles/contracts/fontWeight.contract';

export interface PropsFont {
  fontSize?: tFontSizeValue;
  fontWeight?: tFontWeightValue;
}

export interface PropsUppercase {
  uppercase?: boolean;
}

export interface PropsTextColor {
  color?: tColorValue;
}

export interface PropsTypography extends PropsFont, PropsUppercase, PropsTextColor {}

export interface PropsTextOverflow {
  ellipsis?: boolean;
  maxLines?: number;
}
