<script setup lang="ts">
import type { PropsTypography } from '@/app/shared/types/props/typography.props';
import { computed } from 'vue';
import { resolveColorValue } from '@/app/shared/styles/contracts/color.contract';
import { resolveFontSizeValue } from '@/app/shared/styles/contracts/fontSize.contract';
import { resolveFontWeightValue } from '@/app/shared/styles/contracts/fontWeight.contract';

export type tAppTitleTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface PropsAppTitle extends PropsTypography {
  text: string;
  tag?: tAppTitleTag;
}

const props = withDefaults(defineProps<PropsAppTitle>(), {
  tag: 'h1',
  color: 'text-secondary',
  fontSize: '2xl',
  fontWeight: 'medium',
  uppercase: true,
});

const titleClass = computed(() => [
  'app-title',
  {
    'app-title--uppercase': props.uppercase,
  },
]);

const titleColor = computed(() => resolveColorValue(props.color));

const titleFontSize = computed(() => resolveFontSizeValue(props.fontSize));

const titleFontWeight = computed(() => resolveFontWeightValue(props.fontWeight));
</script>

<template>
  <component :is="tag" :class="titleClass">
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.app-title {
  margin: 0;
  color: v-bind(titleColor);
  font-size: v-bind(titleFontSize);
  font-weight: v-bind(titleFontWeight);
  line-height: var(--app-line-height-heading);
  letter-spacing: var(--app-letter-spacing-wider);

  &.app-title--uppercase {
    text-transform: uppercase;
  }
}
</style>
