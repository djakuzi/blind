<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

import AppBlock from '@/app/shared/components/atoms/block/AppBlock.vue';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';

import {
  resolveBorderStyleValue,
  resolveBorderWidthValue,
  type tBorderStyleValue,
  type tBorderWidthValue,
} from '@/app/styles/contracts/border.contract';

import {
  resolveColorValue,
  type tColorValue,
} from '@/app/styles/contracts/color.contract';

import {
  resolvePaddingValue,
  type tPaddingValue,
} from '@/app/styles/contracts/padding.contract';

import {
  resolveRadiusValue,
  type tRadiusValue,
} from '@/app/styles/contracts/radius.contract';

type tAppCardTag =
  | 'div'
  | 'section'
  | 'article';

export interface PropsAppCard {
  tag?: tAppCardTag
  size?: tBaseSizeVariant
  width?: tStyleSizeValue
  maxWidth?: tStyleSizeValue
  paddingX?: tPaddingValue
  paddingY?: tPaddingValue
  backgroundColor?: tColorValue
  borderColor?: tColorValue
  borderWidth?: tBorderWidthValue
  borderStyle?: tBorderStyleValue
  borderRadius?: tRadiusValue
  overflow?: CSSProperties['overflow']
}

const props = withDefaults(defineProps<PropsAppCard>(), {
  tag: 'div',
  size: 'middle',
  width: '100%',
  maxWidth: '100%',
  paddingX: undefined,
  paddingY: undefined,
  backgroundColor: 'transparent',
  borderColor: 'border-contrast',
  borderWidth: 'thick',
  borderStyle: 'solid',
  borderRadius: 'lg',
  overflow: 'visible',
});

const CARD_PADDING_MAP: Record<
  tBaseSizeVariant,
  {
    x: tPaddingValue
    y: tPaddingValue
  }
> = {
  small: {
    x: 4,
    y: 3,
  },
  middle: {
    x: 5,
    y: 4,
  },
  big: {
    x: 6,
    y: 5,
  },
};

const cardPaddingX = computed(() =>
  resolvePaddingValue(
    props.paddingX
      ?? CARD_PADDING_MAP[props.size].x,
  ),
);

const cardPaddingY = computed(() =>
  resolvePaddingValue(
    props.paddingY
      ?? CARD_PADDING_MAP[props.size].y,
  ),
);

const cardBackgroundColor = computed(() =>
  resolveColorValue(props.backgroundColor),
);

const cardBorderColor = computed(() =>
  resolveColorValue(props.borderColor),
);

const cardBorderWidth = computed(() =>
  resolveBorderWidthValue(props.borderWidth),
);

const cardBorderStyle = computed(() =>
  resolveBorderStyleValue(props.borderStyle),
);

const cardBorderRadius = computed(() =>
  resolveRadiusValue(props.borderRadius),
);
</script>

<template>
  <AppBlock
    class="app-card"
    :tag="tag"
    :width="width"
    :max-width="maxWidth"
    :overflow="overflow"
  >
    <slot />
  </AppBlock>
</template>

<style scoped>
.app-card {
  min-width: 0;
  padding:
    v-bind(cardPaddingY)
    v-bind(cardPaddingX);
  border:
    v-bind(cardBorderWidth)
    v-bind(cardBorderStyle)
    v-bind(cardBorderColor);
  border-radius: v-bind(cardBorderRadius);
  background: v-bind(cardBackgroundColor);
}
</style>
