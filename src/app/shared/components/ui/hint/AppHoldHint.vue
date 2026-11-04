<script setup lang="ts">
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import type { PropsGap } from '@/app/shared/types/props/spacing.props';
import type { PropsWidth } from '@/app/shared/types/props/dimensions.props';
import type { PropsTypography, PropsUppercase } from '@/app/shared/types/props/typography.props';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import AppPulseAttention from '@/app/shared/components/effects/attention/AppPulseAttention.vue';
import type { PropsAppPulseAttention } from '@/app/shared/components/effects/attention/AppPulseAttention.vue';
import { LibStyle } from '@/core/lib/style';

import { BASE_SIZE_FONT_PRESET, BASE_SIZE_SPACE_PRESET } from '@/app/shared/styles/presets/base.preset';
import { resolveColorValue } from '@/app/shared/styles/contracts/color.contract';
import { resolveFontSizeValue } from '@/app/shared/styles/contracts/fontSize.contract';
import { resolveSpaceValue, type tSpaceValue } from '@/app/shared/styles/contracts/space.contract';
import { ToolInput } from '@/core/platform';

export type tAppHoldHintDirection = 'row' | 'column';

export interface iAppHoldHintFinePointerOptions {
  items?: readonly string[];
  direction?: tAppHoldHintDirection;
  gap?: tSpaceValue;
}

export interface PropsAppHoldHint
  extends PropsSizeVariant, PropsGap, Pick<PropsWidth, 'maxWidth'>, Pick<PropsTypography, 'color' | 'fontSize'>, PropsUppercase {
  text?: string;
  items?: readonly string[];
  direction?: tAppHoldHintDirection;
  optionsFinePointer?: iAppHoldHintFinePointerOptions;
  pulse?: boolean;
  optionsPulse?: Pick<PropsAppPulseAttention, 'duration' | 'scale'>;
}

const props = withDefaults(defineProps<PropsAppHoldHint>(), {
  optionsFinePointer: undefined,
  size: 'middle',
  direction: 'column',
  gap: undefined,
  maxWidth: '100%',
  color: 'text-secondary',
  fontSize: undefined,
  pulse: true,
  optionsPulse: undefined,
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
  if (props.optionsFinePointer?.items?.length) {
    return props.optionsFinePointer.items;
  }

  return resolvedItems.value;
});

const pulseProps = computed<NonNullable<PropsAppHoldHint['optionsPulse']>>(() => ({
  duration: props.optionsPulse?.duration ?? 2600,
  scale: props.optionsPulse?.scale ?? 1.025,
}));

const hintItems = computed(() => {
  return hasFineHoverPointer.value ? resolvedFinePointerItems.value : resolvedItems.value;
});

const hintDirection = computed(() => {
  if (hasFineHoverPointer.value) {
    return props.optionsFinePointer?.direction ?? props.direction;
  }

  return props.direction;
});

const hintGap = computed(() => {
  if (hasFineHoverPointer.value) {
    return resolveSpaceValue(props.optionsFinePointer?.gap ?? props.gap ?? BASE_SIZE_SPACE_PRESET[props.size]);
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
  <AppPulseAttention v-bind="pulseProps" :is-active="pulse">
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
