<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style/modules/to.modules';
import type { tSpaceValue } from '@/app/styles/contracts/space.contract';
import { resolveSpaceValue } from '@/app/styles/contracts/space.contract';

type tAppGridTag = 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';

interface Props {
  tag?: tAppGridTag
  placeItems?: CSSProperties['placeItems']
  gap?: tSpaceValue
  width?: tStyleSizeValue
  maxWidth?: tStyleSizeValue
  minHeight?: tStyleSizeValue
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

const gridGap = computed(() => resolveSpaceValue(props.gap));
const gridWidth = computed(() => LibStyle.toSizeValue(props.width));
const gridMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));
const gridMinHeight = computed(() => LibStyle.toSizeValue(props.minHeight));
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
