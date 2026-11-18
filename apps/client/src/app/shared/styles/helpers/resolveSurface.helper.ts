import type { PropsSurface } from '@/app/shared/types/props/surface.props';
import { resolveBorderStyleValue, resolveBorderWidthValue } from '@/app/shared/styles/contracts/border.contract';
import { resolveColorValue } from '@/app/shared/styles/contracts/color.contract';
import { resolveRadiusValue } from '@/app/shared/styles/contracts/radius.contract';

export function resolveSurface(surface: PropsSurface) {
  return {
    backgroundColor: resolveColorValue(surface.backgroundColor),
    borderColor: resolveColorValue(surface.borderColor),
    borderWidth: resolveBorderWidthValue(surface.borderWidth),
    borderStyle: resolveBorderStyleValue(surface.borderStyle),
    borderRadius: resolveRadiusValue(surface.borderRadius),
  };
}
