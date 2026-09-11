import { computed } from 'vue';
import { useRoute } from 'vue-router';

import type { tLayoutSafeArea } from '@/app/layouts/types/layout.type';
import { safeAreaTokenVar } from '@/app/styles/contracts/safeArea.contract';

function resolveLayoutPadding(safeArea: tLayoutSafeArea) {
  const vertical = safeAreaTokenVar('vertical');
  const horizontal = safeAreaTokenVar('horizontal');

  if (safeArea === false || safeArea === 'none') {
    return {
      value: '0',
      horizontal: '0',
      vertical: '0',
    };
  }

  if (safeArea === 'horizontal') {
    return {
      value: `0 ${horizontal}`,
      horizontal,
      vertical: '0',
    };
  }

  if (safeArea === 'vertical') {
    return {
      value: `${vertical} 0`,
      horizontal: '0',
      vertical,
    };
  }

  return {
    value: `${vertical} ${horizontal}`,
    horizontal,
    vertical,
  };
}

export function useLayoutPadding() {
  const route = useRoute();

  const resolvedPadding = computed(() =>
    resolveLayoutPadding(
      route.meta.layout?.safeArea ?? true,
    ),
  );

  const layoutPadding = computed(() =>
    resolvedPadding.value.value,
  );

  const layoutPaddingHorizontal = computed(() =>
    resolvedPadding.value.horizontal,
  );

  const layoutPaddingVertical = computed(() =>
    resolvedPadding.value.vertical,
  );

  return {
    layoutPadding,
    layoutPaddingHorizontal,
    layoutPaddingVertical,
  };
}