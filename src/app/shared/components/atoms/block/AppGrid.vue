<script setup lang="ts">
import { computed } from 'vue';

import type { tSpaceValue } from '@/app/styles/contracts/space.contract';
import { resolveSpaceValue } from '@/app/styles/contracts/space.contract';

type tAppGridTag = 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';
type tAppGridPlace = 'start' | 'center' | 'end' | 'stretch';
type tAppGridSizeValue = number | string;

interface Props {
  tag?: tAppGridTag
  placeItems?: tAppGridPlace
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

const gridClass = computed(() => [
  'app-grid',
  `app-grid--place-${props.placeItems}`,
]);

const gridGap = computed(() => resolveSpaceValue(props.gap));
const gridWidth = computed(() => resolveSizeValue(props.width));
const gridMaxWidth = computed(() => resolveSizeValue(props.maxWidth));
const gridMinHeight = computed(() => resolveSizeValue(props.minHeight));
const gridMargin = computed(() => resolveSpaceValue(props.margin));
</script>

<template>
  <component
    :is="tag"
    :class="gridClass"
  >
    <slot />
  </component>
</template>

<style scoped>
.app-grid {
  display: grid;
  width: v-bind(gridWidth);
  max-width: v-bind(gridMaxWidth);
  min-height: v-bind(gridMinHeight);
  gap: v-bind(gridGap);
  margin: v-bind(gridMargin);
}

.app-grid--place-start {
  place-items: start;
}

.app-grid--place-center {
  place-items: center;
}

.app-grid--place-end {
  place-items: end;
}

.app-grid--place-stretch {
  place-items: stretch;
}
</style>
