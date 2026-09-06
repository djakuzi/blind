<script setup lang="ts">
import { computed } from 'vue';
import {
  resolveColorValue,
  type tColorValue,
} from '@/app/styles/contracts/color.contract';
import {
  resolveFontSizeValue,
  type tFontSizeValue,
} from '@/app/styles/contracts/fontSize.contract';
import {
  resolveFontWeightValue,
  type tFontWeightValue,
} from '@/app/styles/contracts/fontWeight.contract';

type tAppTitleTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

interface Props {
  text: string
  tag?: tAppTitleTag
  color?: tColorValue
  fontSize?: tFontSizeValue
  fontWeight?: tFontWeightValue
  uppercase?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'h1',
  color: 'text-secondary',
  fontSize: '3xl',
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

const titleFontSize = computed(() =>
  resolveFontSizeValue(props.fontSize),
);

const titleFontWeight = computed(() =>
  resolveFontWeightValue(props.fontWeight),
);
</script>

<template>
  <component
    :is="tag"
    :class="titleClass"
  >
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
