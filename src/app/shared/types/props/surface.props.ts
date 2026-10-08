import type { tBorderStyleValue, tBorderWidthValue } from '@/app/styles/contracts/border.contract';
import type { tColorValue } from '@/app/styles/contracts/color.contract';
import type { tRadiusValue } from '@/app/styles/contracts/radius.contract';

export interface PropsSurfaceBackground {
  backgroundColor?: tColorValue;
}

export interface PropsSurfaceBorder {
  borderColor?: tColorValue;
  borderWidth?: tBorderWidthValue;
  borderStyle?: tBorderStyleValue;
}

export interface PropsSurfaceRadius {
  borderRadius?: tRadiusValue;
}

export interface PropsSurface extends PropsSurfaceBackground, PropsSurfaceBorder, PropsSurfaceRadius {}
