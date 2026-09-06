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

type tAppTextTag =
  | 'p'
  | 'span'
  | 'div'
  | 'label';

interface Props {
  text: string
  tag?: tAppTextTag
  color?: tColorValue
  fontSize?: tFontSizeValue
  fontWeight?: tFontWeightValue
  uppercase?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'p',
  color: 'text-primary',
  fontSize: 'md',
  fontWeight: 'medium',
  uppercase: false,
});

const textClass = computed(() => [
  'app-text',
  {
    'app-text--uppercase': props.uppercase,
  },
]);

const textColor = computed(() =>
  resolveColorValue(props.color),
);

const textFontSize = computed(() =>
  resolveFontSizeValue(props.fontSize),
);

const textFontWeight = computed(() =>
  resolveFontWeightValue(props.fontWeight),
);
</script>

<template>
  <component
    :is="tag"
    :class="textClass"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.app-text {
  margin: 0;
  color: v-bind(textColor);
  font-size: v-bind(textFontSize);
  font-weight: v-bind(textFontWeight);
  line-height: var(--app-line-height-body);
  letter-spacing: var(--app-letter-spacing-wide);

  &.app-text--uppercase {
    text-transform: uppercase;
  }
}
</style>