import type { tBorderStyleValue, tBorderWidthValue } from '@/app/styles/contracts/border.contract';
import type { tColorValue } from '@/app/styles/contracts/color.contract';
import type { tRadiusValue } from '@/app/styles/contracts/radius.contract';

export interface PropsBackground {
  backgroundColor?: tColorValue;
}

export interface PropsBorderRadius {
  borderRadius?: tRadiusValue;
}

export interface PropsBorder extends PropsBorderRadius {
  borderColor?: tColorValue;
  borderWidth?: tBorderWidthValue;
  borderStyle?: tBorderStyleValue;
}

export interface PropsSurface extends PropsBackground, PropsBorder {}
