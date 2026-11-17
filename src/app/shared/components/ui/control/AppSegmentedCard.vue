<script setup lang="ts">
import type { PropsWidth } from '@/app/shared/types/props/dimensions.props';
import type { PropsPadding, PropsGap } from '@/app/shared/types/props/spacing.props';
import type { PropsBorderRadius } from '@/app/shared/types/props/surface.props';
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import type { PropsDisabled, PropsSelectionFeedback } from '@/app/shared/types/props/interaction.props';
import { computed } from 'vue';
import AppImage from '@/app/shared/components/elements/media/AppImage.vue';
import AppText from '@/app/shared/components/elements/typography/AppText.vue';
import type { PropsAppText } from '@/app/shared/components/elements/typography/AppText.vue';
import { useSelectionFeedback } from '@/app/shared/composables/interaction/useSelectionFeedback';
import { useAppThemeMode } from '@/app/shared/composables/system/useAppThemeMode';
import { LibStyle } from '@/core/lib/style';
import type { tStyleSizeValue } from '@/core/lib/style';
import type { tBaseSizeVariant } from '@/app/shared/styles/contracts/base';
import {
  resolveBorderStyleValue,
  resolveBorderWidthValue,
  type tBorderStyleValue,
  type tBorderWidthValue,
} from '@/app/shared/styles/contracts/border.contract';
import { resolveColorValue, type tColorValue } from '@/app/shared/styles/contracts/color.contract';
import { resolvePaddingValue, type tPaddingValue } from '@/app/shared/styles/contracts/padding.contract';
import { CONTROL_SIZE_PRESET } from '@/app/shared/styles/presets/control.preset';
import { resolveRadiusValue, type tRadiusValue } from '@/app/shared/styles/contracts/radius.contract';
import { resolveSpaceValue, type tSpaceValue } from '@/app/shared/styles/contracts/space.contract';

export interface iAppSegmentedCardOptionImage {
  light: string;
  dark: string;
  active?: string;
  alt?: string;
}

export interface iAppSegmentedCardOption {
  label: string;
  value: string;
  image?: iAppSegmentedCardOptionImage;
  disabled?: boolean;
}

export interface PropsAppSegmentedCard
  extends PropsWidth, PropsPadding, PropsGap, PropsBorderRadius, PropsSizeVariant, PropsDisabled, PropsSelectionFeedback {
  modelValue: string;
  options: readonly iAppSegmentedCardOption[];
  optionsText?: tAppSegmentedCardTextOptions;
  optionsImage?: iAppSegmentedCardImageOptions;
  minWidth?: tStyleSizeValue;
  optionsFrame?: iAppSegmentedCardFrameOptions;
  equalWidth?: boolean;
}

export type tAppSegmentedCardTextOptions = Pick<PropsAppText, 'color' | 'fontSize' | 'fontWeight' | 'uppercase' | 'lineHeight'>;

export interface iAppSegmentedCardImageOptions {
  size?: tStyleSizeValue;
  textGap?: tSpaceValue;
}

export interface iAppSegmentedCardFrameOptions {
  enabled?: boolean;
  padding?: tPaddingValue;
  borderColor?: tColorValue;
  borderWidth?: tBorderWidthValue;
  borderStyle?: tBorderStyleValue;
  borderRadius?: tRadiusValue;
}

const props = withDefaults(defineProps<PropsAppSegmentedCard>(), {
  disabled: false,
  sound: 'sfx.selection.default',
  vibration: true,
  size: 'middle',
  equalWidth: true,
  borderRadius: 'md',
  width: 'auto',
  minWidth: '0',
  maxWidth: '100%',
  gap: 2,
  paddingX: undefined,
  paddingY: undefined,
  optionsText: undefined,
  optionsImage: undefined,
  optionsFrame: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const IMAGE_SIZE_PRESET: Record<tBaseSizeVariant, tStyleSizeValue> = {
  small: '3rem',
  middle: '4rem',
  big: '5rem',
};

const FRAME_PRESET: Record<tBaseSizeVariant, { padding: tPaddingValue; borderWidth: tBorderWidthValue }> = {
  small: {
    padding: 1,
    borderWidth: 'thin',
  },
  middle: {
    padding: 1,
    borderWidth: 'thin',
  },
  big: {
    padding: 2,
    borderWidth: 'thin',
  },
};

const { triggerSelectionFeedback } = useSelectionFeedback(props);
const { resolvedThemeMode } = useAppThemeMode();

const controlWidth = computed(() => LibStyle.toSizeValue(props.width));
const controlMinWidth = computed(() => LibStyle.toSizeValue(props.minWidth));
const controlMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));
const controlGap = computed(() => resolveSpaceValue(props.gap));
const itemImageTextGap = computed(() => resolveSpaceValue(props.optionsImage?.textGap ?? 3));
const itemBorderRadius = computed(() => resolveRadiusValue(props.borderRadius));
const frameEnabled = computed(() => props.optionsFrame?.enabled ?? false);
const framePadding = computed(() => resolvePaddingValue(props.optionsFrame?.padding ?? FRAME_PRESET[props.size].padding));
const frameBorderColor = computed(() => resolveColorValue(props.optionsFrame?.borderColor ?? 'border-strong'));
const frameBorderWidth = computed(() => resolveBorderWidthValue(props.optionsFrame?.borderWidth ?? FRAME_PRESET[props.size].borderWidth));
const frameBorderStyle = computed(() => resolveBorderStyleValue(props.optionsFrame?.borderStyle ?? 'solid'));
const frameBorderRadius = computed(() => resolveRadiusValue(props.optionsFrame?.borderRadius ?? props.borderRadius));
const itemPaddingX = computed(() => resolvePaddingValue(props.paddingX ?? CONTROL_SIZE_PRESET[props.size].paddingX));
const itemPaddingY = computed(() => resolvePaddingValue(props.paddingY ?? CONTROL_SIZE_PRESET[props.size].paddingY));
const itemFontSize = computed(() => props.optionsText?.fontSize ?? CONTROL_SIZE_PRESET[props.size].fontSize);
const resolvedImageSize = computed(() => LibStyle.toSizeValue(props.optionsImage?.size ?? IMAGE_SIZE_PRESET[props.size]));

function isOptionSelected(option: iAppSegmentedCardOption) {
  return option.value === props.modelValue;
}

function resolveOptionImage(option: iAppSegmentedCardOption) {
  if (!option.image) {
    return null;
  }

  if (isOptionSelected(option)) {
    return option.image.active ?? option.image.dark;
  }

  return option.image[resolvedThemeMode.value];
}

function handleSelect(option: iAppSegmentedCardOption) {
  if (props.disabled || option.disabled || isOptionSelected(option)) {
    return;
  }

  emit('update:modelValue', option.value);

  triggerSelectionFeedback();
}
</script>

<template>
  <div
    class="app-segmented-card"
    :class="{
      'app-segmented-card--framed': frameEnabled,
      'app-segmented-card--disabled': disabled,
      'app-segmented-card--equal-width': equalWidth,
    }"
    role="radiogroup"
  >
    <button
      v-for="option in options"
      :key="option.value"
      class="app-segmented-card__item app-interactive"
      :class="{
        'app-interactive--selected': isOptionSelected(option),
        'app-segmented-card__item--with-image': option.image,
        'app-segmented-card__item--disabled': option.disabled,
      }"
      type="button"
      role="radio"
      :aria-checked="isOptionSelected(option)"
      :disabled="disabled || option.disabled"
      @click="handleSelect(option)"
    >
      <AppImage
        v-if="option.image"
        class="app-segmented-card__image"
        :src="resolveOptionImage(option) ?? ''"
        :alt="option.image.alt ?? ''"
        :width="resolvedImageSize"
        :height="resolvedImageSize"
        object-fit="contain"
      />

      <AppText
        class="app-segmented-card__text"
        :text="option.label"
        tag="span"
        :color="optionsText?.color ?? 'inherit'"
        :font-size="optionsText?.fontSize ?? itemFontSize"
        :font-weight="optionsText?.fontWeight ?? 'bold'"
        :uppercase="optionsText?.uppercase ?? true"
        :line-height="optionsText?.lineHeight"
        :ellipsis="true"
      />
    </button>
  </div>
</template>

<style scoped>
.app-segmented-card {
  display: inline-flex;
  width: v-bind(controlWidth);
  max-width: v-bind(controlMaxWidth);
  min-width: v-bind(controlMinWidth);
  gap: v-bind(controlGap);
}

.app-segmented-card--framed {
  padding: v-bind(framePadding);
  border: v-bind(frameBorderWidth) v-bind(frameBorderStyle) v-bind(frameBorderColor);
  border-radius: v-bind(frameBorderRadius);
}

.app-segmented-card--equal-width {
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
}

.app-segmented-card__item {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  justify-content: center;
  min-width: 0;
  box-sizing: border-box;
  gap: v-bind(itemImageTextGap);
  padding: v-bind(itemPaddingY) v-bind(itemPaddingX);
  border: var(--app-border-width-medium) var(--app-border-style-solid) var(--app-color-border-subtle);
  border-radius: v-bind(itemBorderRadius);
  background: var(--app-color-surface-primary);
  color: var(--app-color-text-primary);
  appearance: none;

  &.app-interactive--selected {
    border-color: var(--app-color-primary);
  }
}

.app-segmented-card--equal-width .app-segmented-card__item {
  width: 100%;
}

.app-segmented-card__image {
  flex: 0 0 auto;
}

.app-segmented-card__text {
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
}

.app-segmented-card--disabled {
  filter: contrast(0.6);
}

.app-segmented-card:not(.app-segmented-card--disabled) .app-segmented-card__item--disabled {
  filter: contrast(0.6);
}

@media (hover: hover) and (pointer: fine) {
  .app-segmented-card__item--with-image.app-interactive:not(.app-interactive--selected):not(:disabled):not(
      .app-interactive--disabled
    ):hover {
    color: var(--app-color-text-primary);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-segmented-card__item {
    transition: none;
  }
}
</style>
