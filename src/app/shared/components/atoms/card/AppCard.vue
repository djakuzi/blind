<script setup lang="ts">
import type { PropsWidth } from '@/app/shared/types/props/dimensions.props';
import type { PropsPadding } from '@/app/shared/types/props/spacing.props';
import type { PropsSurface } from '@/app/shared/types/props/surface.props';
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import AppBlock from '@/app/shared/components/atoms/block/AppBlock.vue';

import type { tBaseSizeVariant } from '@/app/shared/styles/contracts/base';
import { resolveBorderStyleValue, resolveBorderWidthValue } from '@/app/shared/styles/contracts/border.contract';
import { resolveColorValue } from '@/app/shared/styles/contracts/color.contract';
import { resolvePaddingValue, type tPaddingValue } from '@/app/shared/styles/contracts/padding.contract';
import { resolveRadiusValue } from '@/app/shared/styles/contracts/radius.contract';

type tAppCardTag = 'div' | 'section' | 'article';
export type tAppCardCornerStyle = 'rounded' | 'angular';

export interface PropsAppCard extends PropsWidth, PropsPadding, PropsSurface, PropsSizeVariant {
  tag?: tAppCardTag;
  cornerStyle?: tAppCardCornerStyle;
  glow?: boolean;
  overflow?: CSSProperties['overflow'];
}

const props = withDefaults(defineProps<PropsAppCard>(), {
  tag: 'div',
  cornerStyle: 'rounded',
  glow: false,
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
    x: tPaddingValue;
    y: tPaddingValue;
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

const cardPaddingX = computed(() => resolvePaddingValue(props.paddingX ?? CARD_PADDING_MAP[props.size].x));

const cardPaddingY = computed(() => resolvePaddingValue(props.paddingY ?? CARD_PADDING_MAP[props.size].y));

const cardBackgroundColor = computed(() => resolveColorValue(props.backgroundColor));

const cardBorderColor = computed(() => resolveColorValue(props.borderColor));

const cardBorderWidth = computed(() => resolveBorderWidthValue(props.borderWidth));

const cardBorderStyle = computed(() => resolveBorderStyleValue(props.borderStyle));

const cardBorderRadius = computed(() => resolveRadiusValue(props.borderRadius));

const cardClass = computed(() => [
  'app-card',
  {
    'app-card--angular': props.cornerStyle === 'angular',
    'app-card--glow': props.glow,
  },
]);
</script>

<template>
  <AppBlock :class="cardClass" :tag="tag" :width="width" :max-width="maxWidth" :overflow="overflow">
    <div class="app-card__frame">
      <div class="app-card__surface">
        <slot />
      </div>
    </div>
  </AppBlock>
</template>

<style scoped>
.app-card {
  --cp-card-border-color: v-bind(cardBorderColor);
  --cp-card-corner-cut: v-bind(cardBorderRadius);
  min-width: 0;
  transition: filter var(--app-motion-duration-medium) var(--app-motion-ease-default);
}

.app-card--glow {
  filter: drop-shadow(0 0 0 color-mix(in srgb, var(--app-color-primary) 100%, transparent))
    drop-shadow(0 0 1rem color-mix(in srgb, var(--app-color-primary) 50%, transparent))
    drop-shadow(0 0 1.25rem color-mix(in srgb, var(--app-color-primary) 34%, transparent))
    drop-shadow(0 0 1.5rem color-mix(in srgb, var(--app-color-primary) 16%, transparent));
}

.app-card:not(.app-card--angular) {
  border-radius: v-bind(cardBorderRadius);
}

.app-card__frame,
.app-card__surface {
  box-sizing: border-box;
  min-width: 0;
  height: 100%;
}

.app-card__surface {
  padding: v-bind(cardPaddingY) v-bind(cardPaddingX);
  border: v-bind(cardBorderWidth) v-bind(cardBorderStyle) var(--cp-card-border-color);
  border-radius: v-bind(cardBorderRadius);
  background: v-bind(cardBackgroundColor);
}

.app-card.app-card--angular .app-card__frame {
  padding: v-bind(cardBorderWidth);
  border: 0;
  border-radius: 0;
  background-color: var(--cp-card-border-color);
  clip-path: polygon(
    0 var(--cp-card-corner-cut),
    var(--cp-card-corner-cut) 0,
    calc(100% - var(--cp-card-corner-cut)) 0,
    100% var(--cp-card-corner-cut),
    100% calc(100% - var(--cp-card-corner-cut)),
    calc(100% - var(--cp-card-corner-cut)) 100%,
    var(--cp-card-corner-cut) 100%,
    0 calc(100% - var(--cp-card-corner-cut))
  );
  transition: 0.3s background-color linear;
}

.app-card.app-card--angular .app-card__surface {
  border: 0;
  border-radius: 0;
  background: v-bind(cardBackgroundColor);
  clip-path: polygon(
    0 var(--cp-card-corner-cut),
    var(--cp-card-corner-cut) 0,
    calc(100% - var(--cp-card-corner-cut)) 0,
    100% var(--cp-card-corner-cut),
    100% calc(100% - var(--cp-card-corner-cut)),
    calc(100% - var(--cp-card-corner-cut)) 100%,
    var(--cp-card-corner-cut) 100%,
    0 calc(100% - var(--cp-card-corner-cut))
  );
}
</style>
