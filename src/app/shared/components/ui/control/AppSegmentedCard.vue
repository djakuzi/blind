<script setup lang="ts">
import type { PropsWidth } from '@/app/shared/types/props/dimensions.props';
import type { PropsPadding, PropsGap } from '@/app/shared/types/props/spacing.props';
import type { PropsBorderRadius } from '@/app/shared/types/props/surface.props';
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import type { PropsDisabled, PropsSelectionFeedback } from '@/app/shared/types/props/interaction.props';
import { computed } from 'vue';
import AppImage from '@/app/shared/components/atoms/media/AppImage.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import { useAudio } from '@/app/shared/composables/audio/useAudio';
import { useAppThemeMode } from '@/app/shared/composables/system/useAppThemeMode';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { CONTROL_SIZE_PRESET } from '@/app/styles/presets/control.preset';
import { resolvePaddingValue } from '@/app/styles/contracts/padding.contract';
import { resolveRadiusValue } from '@/app/styles/contracts/radius.contract';
import { resolveSpaceValue, type tSpaceValue } from '@/app/styles/contracts/space.contract';
import { ToolVibration } from '@/core/platform';

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
  extends PropsWidth, PropsPadding, PropsBorderRadius, PropsSizeVariant, PropsGap, PropsDisabled, PropsSelectionFeedback {
  modelValue: string;
  options: readonly iAppSegmentedCardOption[];
  equalWidth?: boolean;
  imageTextGap?: tSpaceValue;
  imageSize?: tStyleSizeValue;
}

const props = withDefaults(defineProps<PropsAppSegmentedCard>(), {
  disabled: false,
  sound: 'sfx.selection.default',
  vibration: true,
  size: 'middle',
  width: 'auto',
  maxWidth: '100%',
  equalWidth: true,
  gap: 2,
  imageTextGap: 3,
  paddingX: undefined,
  paddingY: undefined,
  borderRadius: 'md',
  imageSize: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const IMAGE_SIZE_PRESET: Record<tBaseSizeVariant, tStyleSizeValue> = {
  small: '3rem',
  middle: '4rem',
  big: '5rem',
};

const { play } = useAudio();
const { resolvedThemeMode } = useAppThemeMode();

const sizeConfig = computed(() => CONTROL_SIZE_PRESET[props.size]);
const controlWidth = computed(() => LibStyle.toSizeValue(props.width));
const controlMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));
const controlGap = computed(() => resolveSpaceValue(props.gap));
const itemImageTextGap = computed(() => resolveSpaceValue(props.imageTextGap));
const itemPaddingX = computed(() => resolvePaddingValue(props.paddingX ?? sizeConfig.value.paddingX));
const itemPaddingY = computed(() => resolvePaddingValue(props.paddingY ?? sizeConfig.value.paddingY));
const itemBorderRadius = computed(() => resolveRadiusValue(props.borderRadius));
const itemFontSize = computed(() => sizeConfig.value.fontSize);
const resolvedImageSize = computed(() => LibStyle.toSizeValue(props.imageSize ?? IMAGE_SIZE_PRESET[props.size]));

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

  if (props.sound !== null) {
    play(props.sound);
  }

  if (props.vibration) {
    ToolVibration.selectionChanged();
  }
}
</script>

<template>
  <div
    class="app-segmented-card"
    :class="{
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
        color="inherit"
        :font-size="itemFontSize"
        font-weight="bold"
        :uppercase="true"
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
  min-width: 0;
  gap: v-bind(controlGap);
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
  border:
    var(--app-border-width-medium)
    var(--app-border-style-solid)
    var(--app-color-border-strong);
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
  .app-segmented-card__item--with-image.app-interactive:not(.app-interactive--selected):not(:disabled):not(.app-interactive--disabled):hover {
    color: var(--app-color-text-primary);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-segmented-card__item {
    transition: none;
  }
}
</style>
