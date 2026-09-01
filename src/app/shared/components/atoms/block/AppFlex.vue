<script setup lang="ts">
import { computed } from 'vue';

import type { tSpaceValue } from '@/app/styles/contracts/space.contract';
import { resolveSpaceValue } from '@/app/styles/contracts/space.contract';

type tAppFlexTag = 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';
type tAppFlexDirection = 'row' | 'column';
type tAppFlexAlign = 'start' | 'center' | 'end' | 'stretch';
type tAppFlexJustify = 'start' | 'center' | 'end' | 'between';
type tAppFlexWrap = 'nowrap' | 'wrap';
type tAppFlexSizeValue = number | string;

interface Props {
  tag?: tAppFlexTag
  direction?: tAppFlexDirection
  align?: tAppFlexAlign
  justify?: tAppFlexJustify
  wrap?: tAppFlexWrap
  gap?: tSpaceValue
  width?: tAppFlexSizeValue
  maxWidth?: tAppFlexSizeValue
  margin?: tSpaceValue
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  direction: 'row',
  align: 'stretch',
  justify: 'start',
  wrap: 'nowrap',
  gap: undefined,
  width: undefined,
  maxWidth: undefined,
  margin: undefined,
});

function resolveSizeValue(value?: tAppFlexSizeValue) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}

const flexClass = computed(() => [
  'app-flex',
  `app-flex--direction-${props.direction}`,
  `app-flex--align-${props.align}`,
  `app-flex--justify-${props.justify}`,
  `app-flex--wrap-${props.wrap}`,
]);

const flexGap = computed(() => resolveSpaceValue(props.gap));
const flexWidth = computed(() => resolveSizeValue(props.width));
const flexMaxWidth = computed(() => resolveSizeValue(props.maxWidth));
const flexMargin = computed(() => resolveSpaceValue(props.margin));
</script>

<template>
  <component
    :is="tag"
    :class="flexClass"
  >
    <slot />
  </component>
</template>

<style scoped>
.app-flex {
  display: flex;
  width: v-bind(flexWidth);
  max-width: v-bind(flexMaxWidth);
  gap: v-bind(flexGap);
  margin: v-bind(flexMargin);
}

.app-flex--direction-row {
  flex-direction: row;
}

.app-flex--direction-column {
  flex-direction: column;
}

.app-flex--align-start {
  align-items: flex-start;
}

.app-flex--align-center {
  align-items: center;
}

.app-flex--align-end {
  align-items: flex-end;
}

.app-flex--align-stretch {
  align-items: stretch;
}

.app-flex--justify-start {
  justify-content: flex-start;
}

.app-flex--justify-center {
  justify-content: center;
}

.app-flex--justify-end {
  justify-content: flex-end;
}

.app-flex--justify-between {
  justify-content: space-between;
}

.app-flex--wrap-nowrap {
  flex-wrap: nowrap;
}

.app-flex--wrap-wrap {
  flex-wrap: wrap;
}
</style>
