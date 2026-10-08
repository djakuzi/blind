<script setup lang="ts">
import type { PropsSizeVariant, PropsGap, PropsWidth, PropsTypography, PropsUppercase } from '@/app/shared/types/props';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import AppPulseAttention from '@/app/shared/components/effects/attention/AppPulseAttention.vue';
import { LibStyle } from '@/app/shared/lib/style';

import { BASE_SIZE_FONT_PRESET, BASE_SIZE_SPACE_PRESET } from '@/app/styles/presets/base.preset';
import { resolveColorValue } from '@/app/styles/contracts/color.contract';
import { resolveFontSizeValue } from '@/app/styles/contracts/fontSize.contract';
import { resolveSpaceValue, type tSpaceValue } from '@/app/styles/contracts/space.contract';
import { ToolInput } from '@/core/platform';

export type tAppHoldHintDirection = 'row' | 'column';

export interface PropsAppHoldHint
  extends PropsSizeVariant, PropsGap, Pick<PropsWidth, 'maxWidth'>, Pick<PropsTypography, 'color' | 'fontSize'>, PropsUppercase {
  text?: string;
  items?: readonly string[];
  finePointerItems?: readonly string[];
  direction?: tAppHoldHintDirection;
  finePointerDirection?: tAppHoldHintDirection;
  finePointerGap?: tSpaceValue;
  pulse?: boolean;
  pulseDuration?: number;
  pulseScale?: number;
}

const props = withDefaults(defineProps<PropsAppHoldHint>(), {
  finePointerItems: undefined,
  size: 'middle',
  direction: 'column',
  finePointerDirection: undefined,
  gap: undefined,
  finePointerGap: undefined,
  maxWidth: '100%',
  color: 'text-secondary',
  fontSize: undefined,
  pulse: true,
  pulseDuration: 2600,
  pulseScale: 1.025,
  uppercase: true,
});

const hasFineHoverPointer = ref(ToolInput.hasFineHoverPointer().value);

let unsubscribeFineHoverPointer: (() => void) | undefined;

const resolvedItems = computed<readonly string[]>(() => {
  if (props.items?.length) {
    return props.items;
  }

  if (props.text) {
    return [props.text];
  }

  return [];
});

const resolvedFinePointerItems = computed<readonly string[]>(() => {
  if (props.finePointerItems?.length) {
    return props.finePointerItems;
  }

  return resolvedItems.value;
});

const hintItems = computed(() => {
  return hasFineHoverPointer.value ? resolvedFinePointerItems.value : resolvedItems.value;
});

const hintDirection = computed(() => {
  if (hasFineHoverPointer.value) {
    return props.finePointerDirection ?? props.direction;
  }

  return props.direction;
});

const hintGap = computed(() => {
  if (hasFineHoverPointer.value) {
    return resolveSpaceValue(props.finePointerGap ?? props.gap ?? BASE_SIZE_SPACE_PRESET[props.size]);
  }

  return resolveSpaceValue(props.gap ?? BASE_SIZE_SPACE_PRESET[props.size]);
});

const hintMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));

const hintColor = computed(() => resolveColorValue(props.color));

const hintFontSize = computed(() => resolveFontSizeValue(props.fontSize ?? BASE_SIZE_FONT_PRESET[props.size]));

onMounted(() => {
  hasFineHoverPointer.value = ToolInput.hasFineHoverPointer().value;

  const subscription = ToolInput.onFineHoverPointerChange((matches) => {
    hasFineHoverPointer.value = matches;
  });

  unsubscribeFineHoverPointer = subscription.unsubscribe;
});

onBeforeUnmount(() => {
  unsubscribeFineHoverPointer?.();
});
</script>

<template>
  <AppPulseAttention :is-active="pulse" :duration="pulseDuration" :scale="pulseScale">
    <div
      class="app-hold-hint"
      :class="{
        'app-hold-hint--uppercase': uppercase,
      }"
    >
      <div class="app-hold-hint__content">
        <span v-for="(item, index) in hintItems" :key="index" class="app-hold-hint__item">
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
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: 100%;
  flex-direction: v-bind(hintDirection);
  gap: v-bind(hintGap);
}

.app-hold-hint__item {
  min-width: 0;
  text-wrap: balance;
}
</style>
