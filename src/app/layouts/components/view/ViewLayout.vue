<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

import { safeAreaTokenVar } from '@/app/styles/contracts/safeArea.contract';

type tViewLayoutPadding =
  | 'none'
  | 'safe-area'
  | 'horizontal'
  | 'vertical';

type tViewLayoutHeight =
  | 'full'
  | 'auto';

type tViewLayoutBleed =
  | 'none'
  | 'horizontal'
  | 'vertical'
  | 'all';

interface Props {
  padding?: tViewLayoutPadding
  bleed?: tViewLayoutBleed
  overflow?: CSSProperties['overflow']
  height?: tViewLayoutHeight
  align?: CSSProperties['alignItems'] | 'start' | 'end'
  justify?: CSSProperties['justifyContent'] | 'start' | 'end' | 'between'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'none',
  bleed: 'none',
  overflow: 'hidden',
  height: 'full',
  align: 'stretch',
  justify: 'start',
});

function resolveViewLayoutPadding(
  padding: tViewLayoutPadding,
) {
  const vertical = safeAreaTokenVar('vertical');
  const horizontal = safeAreaTokenVar('horizontal');

  if (padding === 'horizontal') {
    return `0 ${horizontal}`;
  }

  if (padding === 'vertical') {
    return `${vertical} 0`;
  }

  if (padding === 'none') {
    return '0';
  }

  return `${vertical} ${horizontal}`;
}

function resolveViewLayoutAlign(
  align: Props['align'],
) {
  if (align === 'start') {
    return 'flex-start';
  }

  if (align === 'end') {
    return 'flex-end';
  }

  return align;
}

function resolveViewLayoutJustify(
  justify: Props['justify'],
) {
  if (justify === 'start') {
    return 'flex-start';
  }

  if (justify === 'end') {
    return 'flex-end';
  }

  if (justify === 'between') {
    return 'space-between';
  }

  return justify;
}

function resolveBleedHorizontal(
  bleed: tViewLayoutBleed,
) {
  return bleed === 'horizontal' || bleed === 'all'
    ? 'var(--cp-layout-padding-horizontal, 0px)'
    : '0px';
}

function resolveBleedVertical(
  bleed: tViewLayoutBleed,
) {
  return bleed === 'vertical' || bleed === 'all'
    ? 'var(--cp-layout-padding-vertical, 0px)'
    : '0px';
}

const viewLayoutStyle = computed(() => {
  const isFullHeight = props.height === 'full';

  return {
    '--cp-view-layout-align':
      resolveViewLayoutAlign(props.align),

    '--cp-view-layout-flex':
      isFullHeight
        ? '1 1 auto'
        : '0 0 auto',

    '--cp-view-layout-height':
      isFullHeight
        ? '100%'
        : 'auto',

    '--cp-view-layout-justify':
      resolveViewLayoutJustify(props.justify),

    '--cp-view-layout-max-height':
      isFullHeight
        ? '100%'
        : 'none',

    '--cp-view-layout-padding':
      resolveViewLayoutPadding(props.padding),

    '--cp-view-layout-overflow':
      props.overflow,

    '--cp-view-layout-bleed-horizontal':
      resolveBleedHorizontal(props.bleed),

    '--cp-view-layout-bleed-vertical':
      resolveBleedVertical(props.bleed),
  };
});
</script>

<template>
  <section
    class="view-layout"
    :style="viewLayoutStyle"
  >
    <slot />
  </section>
</template>

<style scoped>
.view-layout {
  display: flex;
  align-items: var(--cp-view-layout-align);
  flex: var(--cp-view-layout-flex);
  flex-direction: column;
  justify-content: var(--cp-view-layout-justify);

  width:
    calc(
      100%
      + var(--cp-view-layout-bleed-horizontal) * 2
    );

  height:
    calc(
      var(--cp-view-layout-height)
      + var(--cp-view-layout-bleed-vertical) * 2
    );

  min-height: 0;
  max-width: none;

  margin-inline:
    calc(
      var(--cp-view-layout-bleed-horizontal) * -1
    );

  margin-block:
    calc(
      var(--cp-view-layout-bleed-vertical) * -1
    );

  padding: var(--cp-view-layout-padding);
  overflow: var(--cp-view-layout-overflow);
}
</style>