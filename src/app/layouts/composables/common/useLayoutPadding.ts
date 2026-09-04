import type { tLayoutSafeArea } from '@/app/layouts/types/layout.type';
import { safeAreaTokenVar } from '@/app/styles/contracts/safeArea.contract';

export function resolveLayoutPadding(safeArea: tLayoutSafeArea) {
  const safeAreaVertical = safeAreaTokenVar('vertical');
  const safeAreaHorizontal = safeAreaTokenVar('horizontal');

  if (safeArea === false || safeArea === 'none') {
    return '0';
  }

  if (safeArea === 'horizontal') {
    return `0 ${safeAreaHorizontal}`;
  }

  if (safeArea === 'vertical') {
    return `${safeAreaVertical} 0`;
  }

  return `${safeAreaVertical} ${safeAreaHorizontal}`;
}
