<script setup lang="ts">
import type {
  PropsWidth,
  PropsPadding,
  PropsBorderRadius,
  PropsSizeVariant,
  PropsDisabled,
  PropsSelectionFeedback,
} from '@/app/shared/types/props';
import { computed, ref } from 'vue';
import AppMarqueeText from '@/app/shared/components/ui/text/AppMarqueeText.vue';
import { useAudio } from '@/app/shared/composables/audio/useAudio';
import { LibStyle } from '@/app/shared/lib/style';

import { CONTROL_SIZE_PRESET } from '@/app/styles/presets/control.preset';
import { resolvePaddingValue } from '@/app/styles/contracts/padding.contract';
import { resolveRadiusValue } from '@/app/styles/contracts/radius.contract';
import { ToolVibration } from '@/core/platform';

export interface iAppSegmentedControlOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface PropsAppSegmentedControl
  extends PropsWidth, PropsPadding, PropsBorderRadius, PropsSizeVariant, PropsDisabled, PropsSelectionFeedback {
  modelValue: string;
  options: readonly iAppSegmentedControlOption[];

}

const props = withDefaults(defineProps<PropsAppSegmentedControl>(), {
  disabled: false,
  sound: 'sfx.selection.default',
  vibration: true,
  size: 'middle',
  width: 'auto',
  maxWidth: '100%',
  paddingX: undefined,
  paddingY: undefined,
  borderRadius: 'lg',
});

const { play } = useAudio();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const hoveredOptionValue = ref<string | null>(null);
const focusedOptionValue = ref<string | null>(null);

const sizeConfig = computed(() => CONTROL_SIZE_PRESET[props.size]);
const controlWidth = computed(() => LibStyle.toSizeValue(props.width));
const controlMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));
const controlBorderRadius = computed(() => resolveRadiusValue(props.borderRadius));
const itemPaddingX = computed(() => resolvePaddingValue(props.paddingX ?? sizeConfig.value.paddingX));
const itemPaddingY = computed(() => resolvePaddingValue(props.paddingY ?? sizeConfig.value.paddingY));
const itemFontSize = computed(() => sizeConfig.value.fontSize);
const isContentWidth = computed(() => props.width === 'fit-content' || props.width === 'auto');

function isOptionMarqueePlaying(option: iAppSegmentedControlOption) {
  return (
    option.value === props.modelValue ||
    option.value === hoveredOptionValue.value ||
    option.value === focusedOptionValue.value
  );
}

function handleMouseEnter(option: iAppSegmentedControlOption) {
  hoveredOptionValue.value = option.value;
}

function handleMouseLeave(option: iAppSegmentedControlOption) {
  if (hoveredOptionValue.value === option.value) {
    hoveredOptionValue.value = null;
  }
}

function handleFocus(option: iAppSegmentedControlOption) {
  focusedOptionValue.value = option.value;
}

function handleBlur(option: iAppSegmentedControlOption) {
  if (focusedOptionValue.value === option.value) {
    focusedOptionValue.value = null;
  }
}

function handleSelect(option: iAppSegmentedControlOption) {
  if (props.disabled || option.disabled || option.value === props.modelValue) {
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
    class="app-segmented-control"
    :class="{
      'app-segmented-control--disabled': disabled,
      'app-segmented-control--content-width': isContentWidth,
    }"
    role="radiogroup"
  >
    <button
      v-for="option in options"
      :key="option.value"
      class="app-segmented-control__item app-interactive"
      :class="{
        'app-interactive--selected': option.value === modelValue,
      }"
      type="button"
      role="radio"
      :aria-checked="option.value === modelValue"
      :disabled="disabled || option.disabled"
      @mouseenter="handleMouseEnter(option)"
      @mouseleave="handleMouseLeave(option)"
      @focus="handleFocus(option)"
      @blur="handleBlur(option)"
      @click="handleSelect(option)"
    >
      <AppMarqueeText
        class="app-segmented-control__text"
        :text="option.label"
        color="inherit"
        :font-size="itemFontSize"
        font-weight="bold"
        :uppercase="true"
        :play="isOptionMarqueePlaying(option)"
        :speed="option.value === modelValue ? 40 : undefined"
        :padding-x="itemPaddingX"
      />
    </button>
  </div>
</template>

<style scoped>
.app-segmented-control {
  display: inline-flex;
  width: v-bind(controlWidth);
  max-width: v-bind(controlMaxWidth);
  min-width: 0;
  border: var(--app-border-width-thick) var(--app-border-style-solid) var(--app-color-border-contrast);
  border-radius: v-bind(controlBorderRadius);
  overflow: hidden;
}

.app-segmented-control--content-width {
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
}

.app-segmented-control__item {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  min-width: 0;
  box-sizing: border-box;
  padding: v-bind(itemPaddingY) 0;
  border: 0;
  border-right: var(--app-border-width-medium) var(--app-border-style-solid) var(--app-color-border-contrast);
  background: var(--app-color-surface-primary);
  color: var(--app-color-text-primary);
  appearance: none;

  &:last-child {
    border-right: 0;
  }
}

.app-segmented-control--content-width .app-segmented-control__item {
  width: 100%;
}

.app-segmented-control__text {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}
</style>
