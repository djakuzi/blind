<script lang="ts">
import type { CSSProperties } from 'vue';

import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tSpaceValue } from '@/app/styles/contracts/space.contract';

type tAppBlockTag = 'div' | 'section' | 'article' | 'main' | 'header' | 'footer' | 'span';

export interface PropsAppBlock {
  tag?: tAppBlockTag
  display?: CSSProperties['display']
  overflow?: CSSProperties['overflow']
  width?: tStyleSizeValue
  maxWidth?: tStyleSizeValue
  height?: tStyleSizeValue
  margin?: tSpaceValue
}
</script>

<script setup lang="ts">
import { computed } from 'vue';

import { LibStyle } from '@/app/shared/lib/style';
import { resolveSpaceValue } from '@/app/styles/contracts/space.contract';

const props = withDefaults(defineProps<PropsAppBlock>(), {
  tag: 'div',
  display: 'block',
  overflow: 'visible',
  width: undefined,
  maxWidth: undefined,
  height: undefined,
  margin: undefined,
});

const blockClass = computed(() => [
  'app-block',
]);

const blockStyle = computed(() => ({
  '--cp-block-display': props.display,
  '--cp-block-width': LibStyle.toSizeValue(props.width) ?? 'auto',
  '--cp-block-max-width': LibStyle.toSizeValue(props.maxWidth) ?? 'none',
  '--cp-block-height': LibStyle.toSizeValue(props.height) ?? 'auto',
  '--cp-block-margin': resolveSpaceValue(props.margin) ?? 0,
  '--cp-block-overflow': props.overflow,
}));
</script>

<template>
  <component
    :is="tag"
    :class="blockClass"
    :style="blockStyle"
  >
    <slot />
  </component>
</template>

<style scoped>
.app-block {
  display: var(--cp-block-display);
  width: var(--cp-block-width);
  max-width: var(--cp-block-max-width);
  height: var(--cp-block-height);
  margin: var(--cp-block-margin);
  overflow: var(--cp-block-overflow);
}
</style>
