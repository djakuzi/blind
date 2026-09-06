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
  ellipsis?: boolean
  maxLines?: number
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'p',
  color: 'text-primary',
  fontSize: 'md',
  fontWeight: 'medium',
  uppercase: false,
  ellipsis: false,
  maxLines: 1,
});

const resolvedMaxLines = computed(() =>
  Math.max(1, Math.trunc(props.maxLines)),
);

const textClass = computed(() => [
  'app-text',
  {
    'app-text--uppercase': props.uppercase,
    'app-text--ellipsis': props.ellipsis,
    'app-text--ellipsis-single':
      props.ellipsis && resolvedMaxLines.value === 1,
    'app-text--ellipsis-multiple':
      props.ellipsis && resolvedMaxLines.value > 1,
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

  &.app-text--ellipsis {
    overflow: hidden;
  }

  &.app-text--ellipsis-single {
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.app-text--ellipsis-multiple {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: v-bind(resolvedMaxLines);
    line-clamp: v-bind(resolvedMaxLines);
  }
}
</style>