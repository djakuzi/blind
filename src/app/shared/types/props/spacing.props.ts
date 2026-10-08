import type { tPaddingValue } from '@/app/styles/contracts/padding.contract';
import type { tSpaceValue } from '@/app/styles/contracts/space.contract';

export interface PropsPadding {
  paddingX?: tPaddingValue;
  paddingY?: tPaddingValue;
}

export interface PropsMargin {
  margin?: tSpaceValue;
}

export interface PropsGap {
  gap?: tSpaceValue;
}

export interface PropsSpacing extends PropsMargin, PropsGap {}
