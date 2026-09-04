<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

import type { tSpaceValue } from '@/app/styles/contracts/space.contract';
import { resolveSpaceValue } from '@/app/styles/contracts/space.contract';

type tAppFlexTag = 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';
type tAppFlexSizeValue = number | string;

interface Props {
  tag?: tAppFlexTag
  direction?: CSSProperties['flexDirection']
  align?: CSSProperties['alignItems'] | 'start' | 'end'
  justify?: CSSProperties['justifyContent'] | 'start' | 'end' | 'between'
  wrap?: CSSProperties['flexWrap']
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

function resolveFlexAlign(align: Props['align']) {
  if (align === 'start') {
    return 'flex-start';
  }

  if (align === 'end') {
    return 'flex-end';
  }

  return align;
}

function resolveFlexJustify(justify: Props['justify']) {
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

const flexGap = computed(() => resolveSpaceValue(props.gap));
const flexWidth = computed(() => resolveSizeValue(props.width));
const flexMaxWidth = computed(() => resolveSizeValue(props.maxWidth));
const flexMargin = computed(() => resolveSpaceValue(props.margin));
const flexStyle = computed(() => ({
  '--cp-flex-direction': props.direction,
  '--cp-flex-align': resolveFlexAlign(props.align),
  '--cp-flex-justify': resolveFlexJustify(props.justify),
  '--cp-flex-wrap': props.wrap,
}));
</script>

<template>
  <component
    :is="tag"
    class="app-flex"
    :style="flexStyle"
  >
    <slot />
  </component>
</template>

<style scoped>
.app-flex {
  display: flex;
  flex-direction: var(--cp-flex-direction);
  align-items: var(--cp-flex-align);
  justify-content: var(--cp-flex-justify);
  flex-wrap: var(--cp-flex-wrap);
  width: v-bind(flexWidth);
  max-width: v-bind(flexMaxWidth);
  gap: v-bind(flexGap);
  margin: v-bind(flexMargin);
}
</style>
