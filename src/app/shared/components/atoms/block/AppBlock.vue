<script lang="ts">
import type { tSpaceValue } from '@/app/styles/contracts/space.contract';

export type tAppBlockTag = 'div' | 'section' | 'article' | 'main' | 'header' | 'footer' | 'span';
export type tAppBlockDisplay = 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'none';
export type tAppBlockSizeValue = number | string;

export interface PropsAppBlock {
  tag?: tAppBlockTag
  display?: tAppBlockDisplay
  width?: tAppBlockSizeValue
  maxWidth?: tAppBlockSizeValue
  height?: tAppBlockSizeValue
  margin?: tSpaceValue
}
</script>

<script setup lang="ts">
import { computed } from 'vue';

import { resolveSpaceValue } from '@/app/styles/contracts/space.contract';

const props = withDefaults(defineProps<PropsAppBlock>(), {
  tag: 'div',
  display: 'block',
  width: undefined,
  maxWidth: undefined,
  height: undefined,
  margin: undefined,
});

function resolveSizeValue(value?: tAppBlockSizeValue) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}

const blockClass = computed(() => [
  'app-block',
  `app-block--display-${props.display}`,
]);

const blockStyle = computed(() => ({
  '--cp-block-width': resolveSizeValue(props.width) ?? 'auto',
  '--cp-block-max-width': resolveSizeValue(props.maxWidth) ?? 'none',
  '--cp-block-height': resolveSizeValue(props.height) ?? 'auto',
  '--cp-block-margin': resolveSpaceValue(props.margin) ?? 0,
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
  width: var(--cp-block-width);
  max-width: var(--cp-block-max-width);
  height: var(--cp-block-height);
  margin: var(--cp-block-margin);
}

.app-block--display-block {
  display: block;
}

.app-block--display-inline-block {
  display: inline-block;
}

.app-block--display-flex {
  display: flex;
}

.app-block--display-inline-flex {
  display: inline-flex;
}

.app-block--display-none {
  display: none;
}
</style>
