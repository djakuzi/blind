<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

import type { tSpaceValue } from '@/app/styles/contracts/space.contract';
import { resolveSpaceValue } from '@/app/styles/contracts/space.contract';

type tAppGridTag = 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';
type tAppGridSizeValue = number | string;

interface Props {
  tag?: tAppGridTag
  placeItems?: CSSProperties['placeItems']
  gap?: tSpaceValue
  width?: tAppGridSizeValue
  maxWidth?: tAppGridSizeValue
  minHeight?: tAppGridSizeValue
  margin?: tSpaceValue
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  placeItems: 'stretch',
  gap: undefined,
  width: undefined,
  maxWidth: undefined,
  minHeight: undefined,
  margin: undefined,
});

function resolveSizeValue(value?: tAppGridSizeValue) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}

const gridGap = computed(() => resolveSpaceValue(props.gap));
const gridWidth = computed(() => resolveSizeValue(props.width));
const gridMaxWidth = computed(() => resolveSizeValue(props.maxWidth));
const gridMinHeight = computed(() => resolveSizeValue(props.minHeight));
const gridMargin = computed(() => resolveSpaceValue(props.margin));
const gridStyle = computed(() => ({
  '--cp-grid-place-items': props.placeItems,
}));
</script>

<template>
  <component
    :is="tag"
    class="app-grid"
    :style="gridStyle"
  >
    <slot />
  </component>
</template>

<style scoped>
.app-grid {
  display: grid;
  place-items: var(--cp-grid-place-items);
  width: v-bind(gridWidth);
  max-width: v-bind(gridMaxWidth);
  min-height: v-bind(gridMinHeight);
  gap: v-bind(gridGap);
  margin: v-bind(gridMargin);
}
</style>
