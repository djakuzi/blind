<script setup lang="ts">
import { computed, ref } from 'vue';
import AppMarqueeText from '@/app/shared/components/ui/text/AppMarqueeText.vue';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { CONTROL_SIZE_PRESET } from '@/app/styles/presets/control.preset';
import { resolvePaddingValue, type tPaddingValue } from '@/app/styles/contracts/padding.contract';
import { resolveRadiusValue, type tRadiusValue } from '@/app/styles/contracts/radius.contract';
import { ToolVibration } from '@/core/platform';

export interface iAppSegmentedControlOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface PropsAppSegmentedControl {
  modelValue: string;
  options: readonly iAppSegmentedControlOption[];
  disabled?: boolean;
  vibration?: boolean;
  size?: tBaseSizeVariant;
  width?: tStyleSizeValue;
  maxWidth?: tStyleSizeValue;
  paddingX?: tPaddingValue;
  paddingY?: tPaddingValue;
  borderRadius?: tRadiusValue;
}

const props = withDefaults(defineProps<PropsAppSegmentedControl>(), {
  disabled: false,
  vibration: true,
  size: 'middle',
  width: 'auto',
  maxWidth: '100%',
  paddingX: undefined,
  paddingY: undefined,
  borderRadius: 'lg',
});

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

  if (props.vibration) {
    ToolVibration.selectionChanged();
  }
}
</script>

<template>
  <div class="app-segmented-control" :class="{ 'app-segmented-control--disabled': disabled }" role="radiogroup">
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

.app-segmented-control__item {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: v-bind(itemPaddingY) v-bind(itemPaddingX);
  border: 0;
  border-right: var(--app-border-width-medium) var(--app-border-style-solid) var(--app-color-border-contrast);
  background: var(--app-color-surface-primary);
  color: var(--app-color-text-primary);
  appearance: none;

  &:last-child {
    border-right: 0;
  }
}

.app-segmented-control__text {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}
</style>
