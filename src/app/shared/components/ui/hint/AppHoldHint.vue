<script setup lang="ts">
import { computed } from 'vue';

import AppPulseAttention from '@/app/shared/components/effects/attention/AppPulseAttention.vue';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { resolveColorValue, type tColorValue } from '@/app/styles/contracts/color.contract';
import { resolveFontSizeValue, type tFontSizeValue } from '@/app/styles/contracts/fontSize.contract';
import { resolveSpaceValue, type tSpaceValue } from '@/app/styles/contracts/space.contract';

export type tAppHoldHintDirection = 'row' | 'column';

export interface PropsAppHoldHint {
  items: readonly string[]
  desktopItems?: readonly string[]
  size?: tBaseSizeVariant
  direction?: tAppHoldHintDirection
  desktopDirection?: tAppHoldHintDirection
  gap?: tSpaceValue
  desktopGap?: tSpaceValue
  maxWidth?: tStyleSizeValue
  color?: tColorValue
  fontSize?: tFontSizeValue
  pulse?: boolean
  pulseDuration?: number
  pulseScale?: number
  uppercase?: boolean
}

const props = withDefaults(defineProps<PropsAppHoldHint>(), {
  desktopItems: undefined,
  size: 'middle',
  direction: 'column',
  desktopDirection: undefined,
  gap: undefined,
  desktopGap: undefined,
  maxWidth: '100%',
  color: 'text-secondary',
  fontSize: undefined,
  pulse: true,
  pulseDuration: 2600,
  pulseScale: 1.025,
  uppercase: true,
});

const SIZE_MAP: Record<tBaseSizeVariant, {
  fontSize: tFontSizeValue
  gap: tSpaceValue
}> = {
  small: {
    fontSize: 'sm',
    gap: 2,
  },
  middle: {
    fontSize: 'md',
    gap: 3,
  },
  big: {
    fontSize: 'lg',
    gap: 4,
  },
};

const sizeConfig = computed(() => SIZE_MAP[props.size]);

const resolvedDesktopItems = computed(() =>
  props.desktopItems?.length
    ? props.desktopItems
    : props.items,
);

const hintDirection = computed(() => props.direction);

const hintDesktopDirection = computed(() =>
  props.desktopDirection ?? props.direction,
);

const hintGap = computed(() =>
  resolveSpaceValue(props.gap ?? sizeConfig.value.gap),
);

const hintDesktopGap = computed(() =>
  resolveSpaceValue(
    props.desktopGap
      ?? props.gap
      ?? sizeConfig.value.gap,
  ),
);

const hintMaxWidth = computed(() =>
  LibStyle.toSizeValue(props.maxWidth),
);

const hintColor = computed(() =>
  resolveColorValue(props.color),
);

const hintFontSize = computed(() =>
  resolveFontSizeValue(
    props.fontSize ?? sizeConfig.value.fontSize,
  ),
);
</script>

<template>
  <AppPulseAttention
    :is-active="pulse"
    :duration="pulseDuration"
    :scale="pulseScale"
  >
    <div
      class="app-hold-hint"
      :class="{
        'app-hold-hint--uppercase': uppercase,
      }"
    >
      <div class="app-hold-hint__content app-hold-hint__content--default">
        <span
          v-for="(item, index) in items"
          :key="index"
          class="app-hold-hint__item"
        >
          {{ item }}
        </span>
      </div>

      <div class="app-hold-hint__content app-hold-hint__content--desktop">
        <span
          v-for="(item, index) in resolvedDesktopItems"
          :key="index"
          class="app-hold-hint__item"
        >
          {{ item }}
        </span>
      </div>
    </div>
  </AppPulseAttention>
</template>

<style scoped>
.app-hold-hint {
  display: inline-flex;
  max-width: v-bind(hintMaxWidth);
  min-width: 0;
  color: v-bind(hintColor);
  font-size: v-bind(hintFontSize);
  font-weight: var(--app-font-weight-medium);
  line-height: var(--app-line-height-control);
  letter-spacing: var(--app-letter-spacing-wider);
  text-align: center;
  user-select: none;
  pointer-events: none;
}

.app-hold-hint--uppercase {
  text-transform: uppercase;
}

.app-hold-hint__content {
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: 100%;
}

.app-hold-hint__content--default {
  display: flex;
  flex-direction: v-bind(hintDirection);
  gap: v-bind(hintGap);
}

.app-hold-hint__content--desktop {
  display: none;
  flex-direction: v-bind(hintDesktopDirection);
  gap: v-bind(hintDesktopGap);
}

.app-hold-hint__item {
  min-width: 0;
  text-wrap: balance;
}

@media (hover: hover) and (pointer: fine) {
  .app-hold-hint__content--default {
    display: none;
  }

  .app-hold-hint__content--desktop {
    display: flex;
  }
}
</style>