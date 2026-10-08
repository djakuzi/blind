import type { tStyleSizeValue } from '@/core/lib/style';

export interface PropsWidth {
  width?: tStyleSizeValue;
  maxWidth?: tStyleSizeValue;
}

export interface PropsHeight {
  height?: tStyleSizeValue;
  minHeight?: tStyleSizeValue;
  maxHeight?: tStyleSizeValue;
}

export interface PropsDimensions extends PropsWidth, PropsHeight { }
