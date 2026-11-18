<script setup lang="ts">
import type { PropsWidth } from '@/app/shared/types/props/dimensions.props';
import type { PropsMargin, PropsGap } from '@/app/shared/types/props/spacing.props';
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { LibStyle } from '@/core/lib/style';

import { resolveSpaceValue } from '@/app/shared/styles/contracts/space.contract';

type tAppFlexTag = 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';

export interface PropsAppFlex extends PropsWidth, PropsMargin, PropsGap {
  tag?: tAppFlexTag;
  direction?: CSSProperties['flexDirection'];
  flex?: CSSProperties['flex'];
  align?: CSSProperties['alignItems'] | 'start' | 'end';
  justify?: CSSProperties['justifyContent'] | 'start' | 'end' | 'between' | 'around';
  wrap?: CSSProperties['flexWrap'];
}

const props = withDefaults(defineProps<PropsAppFlex>(), {
  tag: 'div',
  direction: 'row',
  flex: undefined,
  align: 'stretch',
  justify: 'start',
  wrap: 'nowrap',
  gap: undefined,
  width: undefined,
  maxWidth: undefined,
  margin: undefined,
});

function resolveFlexAlign(align: PropsAppFlex['align']) {
  if (align === 'start') {
    return 'flex-start';
  }

  if (align === 'end') {
    return 'flex-end';
  }

  return align;
}

function resolveFlexJustify(justify: PropsAppFlex['justify']) {
  if (justify === 'start') {
    return 'flex-start';
  }

  if (justify === 'end') {
    return 'flex-end';
  }

  if (justify === 'between') {
    return 'space-between';
  }

  if (justify === 'around') {
    return 'space-around';
  }

  return justify;
}

const flexGap = computed(() => resolveSpaceValue(props.gap));
const flexWidth = computed(() => LibStyle.toSizeValue(props.width));
const flexMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));
const flexMargin = computed(() => resolveSpaceValue(props.margin));
const flexStyle = computed(() => ({
  '--cp-flex-direction': props.direction,
  '--cp-flex-flex': props.flex,
  '--cp-flex-align': resolveFlexAlign(props.align),
  '--cp-flex-justify': resolveFlexJustify(props.justify),
  '--cp-flex-wrap': props.wrap,
}));
</script>

<template>
  <component :is="tag" class="app-flex" :style="flexStyle">
    <slot />
  </component>
</template>

<style scoped>
.app-flex {
  display: flex;
  flex-direction: var(--cp-flex-direction);
  flex: var(--cp-flex-flex);
  align-items: var(--cp-flex-align);
  justify-content: var(--cp-flex-justify);
  flex-wrap: var(--cp-flex-wrap);
  width: v-bind(flexWidth);
  max-width: v-bind(flexMaxWidth);
  gap: v-bind(flexGap);
  margin: v-bind(flexMargin);
}
</style>
