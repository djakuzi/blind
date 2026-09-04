<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

import { safeAreaTokenVar } from '@/app/styles/contracts/safeArea.contract';

type tViewLayoutPadding = 'none' | 'safe-area' | 'horizontal' | 'vertical';
type tViewLayoutOverflow = CSSProperties['overflow'];
type tViewLayoutHeight = 'full' | 'auto';

interface Props {
  padding?: tViewLayoutPadding
  overflow?: tViewLayoutOverflow
  height?: tViewLayoutHeight
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'none',
  overflow: 'hidden',
  height: 'full',
});

function resolveViewLayoutPadding(padding: tViewLayoutPadding) {
  const safeAreaVertical = safeAreaTokenVar('vertical');
  const safeAreaHorizontal = safeAreaTokenVar('horizontal');

  if (padding === 'horizontal') {
    return `0 ${safeAreaHorizontal}`;
  }

  if (padding === 'vertical') {
    return `${safeAreaVertical} 0`;
  }

  if (padding === 'none') {
    return '0';
  }

  return `${safeAreaVertical} ${safeAreaHorizontal}`;
}

const viewLayoutStyle = computed(() => {
  const isFullHeight = props.height === 'full';

  return {
    '--cp-view-layout-flex': isFullHeight ? '1 1 auto' : '0 0 auto',
    '--cp-view-layout-height': isFullHeight ? '100%' : 'auto',
    '--cp-view-layout-max-height': isFullHeight ? '100%' : 'none',
    '--cp-view-layout-padding': resolveViewLayoutPadding(props.padding),
    '--cp-view-layout-overflow': props.overflow,
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
  flex: var(--cp-view-layout-flex);
  flex-direction: column;
  width: 100%;
  height: var(--cp-view-layout-height);
  min-height: 0;
  max-width: 100%;
  max-height: var(--cp-view-layout-max-height);
  padding: var(--cp-view-layout-padding);
  overflow: var(--cp-view-layout-overflow);
}
</style>
