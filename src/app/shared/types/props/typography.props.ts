import type { tColorValue } from '@/app/styles/contracts/color.contract';
import type { tFontSizeValue } from '@/app/styles/contracts/fontSize.contract';
import type { tFontWeightValue } from '@/app/styles/contracts/fontWeight.contract';

export interface PropsFont {
  fontSize?: tFontSizeValue;
  fontWeight?: tFontWeightValue;
}

export interface PropsLetterCase {
  uppercase?: boolean;
}

export interface PropsTypographyColor {
  color?: tColorValue;
}

export interface PropsTextColor {
  textColor?: tColorValue;
}

export interface PropsTypography extends PropsFont, PropsTypographyColor, PropsLetterCase {}

export interface PropsTextTypography extends PropsFont, PropsTextColor, PropsLetterCase {}

export interface PropsTextOverflow {
  ellipsis?: boolean;
  maxLines?: number;
}
