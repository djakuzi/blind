<script setup lang="ts">
import { computed, ref } from 'vue';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { CONTROL_SIZE_PRESET } from '@/app/styles/presets/control.preset';
import {
  resolveBorderStyleValue,
  resolveBorderWidthValue,
  type tBorderStyleValue,
  type tBorderWidthValue,
} from '@/app/styles/contracts/border.contract';
import { resolveColorValue, type tColorValue } from '@/app/styles/contracts/color.contract';
import { resolveFontSizeValue, type tFontSizeValue } from '@/app/styles/contracts/fontSize.contract';
import { resolveFontWeightValue, type tFontWeightValue } from '@/app/styles/contracts/fontWeight.contract';
import { resolvePaddingValue, type tPaddingValue } from '@/app/styles/contracts/padding.contract';
import { resolveRadiusValue, type tRadiusValue } from '@/app/styles/contracts/radius.contract';

export interface PropsInputSearch {
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  size?: tBaseSizeVariant;
  width?: tStyleSizeValue;
  maxWidth?: tStyleSizeValue;
  paddingX?: tPaddingValue;
  paddingY?: tPaddingValue;
  backgroundColor?: tColorValue;
  textColor?: tColorValue;
  placeholderColor?: tColorValue;
  borderColor?: tColorValue;
  borderWidth?: tBorderWidthValue;
  borderStyle?: tBorderStyleValue;
  borderRadius?: tRadiusValue;
  fontSize?: tFontSizeValue;
  fontWeight?: tFontWeightValue;
  name?: string;
  autocomplete?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

const props = withDefaults(defineProps<PropsInputSearch>(), {
  placeholder: undefined,
  disabled: false,
  readonly: false,
  size: 'middle',
  width: '100%',
  maxWidth: '100%',
  paddingX: undefined,
  paddingY: undefined,
  backgroundColor: 'surface-primary',
  textColor: 'text-primary',
  placeholderColor: 'text-tertiary',
  borderColor: 'border-contrast',
  borderWidth: 'thick',
  borderStyle: 'solid',
  borderRadius: 'lg',
  fontSize: undefined,
  fontWeight: 'medium',
  name: undefined,
  autocomplete: 'off',
  ariaLabel: undefined,
  ariaLabelledby: undefined,
  ariaDescribedby: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const sizeConfig = computed(() => CONTROL_SIZE_PRESET[props.size]);

const inputStyle = computed(() => ({
  '--cp-input-search-width': LibStyle.toSizeValue(props.width),
  '--cp-input-search-max-width': LibStyle.toSizeValue(props.maxWidth),
  '--cp-input-search-padding-x': resolvePaddingValue(props.paddingX ?? sizeConfig.value.paddingX),
  '--cp-input-search-padding-y': resolvePaddingValue(props.paddingY ?? sizeConfig.value.paddingY),
  '--cp-input-search-background-color': resolveColorValue(props.backgroundColor),
  '--cp-input-search-text-color': resolveColorValue(props.disabled ? 'text-disabled' : props.textColor),
  '--cp-input-search-placeholder-color': resolveColorValue(props.disabled ? 'text-disabled' : props.placeholderColor),
  '--cp-input-search-border-color': resolveColorValue(props.borderColor),
  '--cp-input-search-border-width': resolveBorderWidthValue(props.borderWidth),
  '--cp-input-search-border-style': resolveBorderStyleValue(props.borderStyle),
  '--cp-input-search-border-radius': resolveRadiusValue(props.borderRadius),
  '--cp-input-search-font-size': resolveFontSizeValue(props.fontSize ?? sizeConfig.value.fontSize),
  '--cp-input-search-font-weight': resolveFontWeightValue(props.fontWeight),
}));

function handleInput(event: Event) {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  emit('update:modelValue', target.value);
}

function handleFocus(event: FocusEvent) {
  emit('focus', event);
}

function handleBlur(event: FocusEvent) {
  emit('blur', event);
}

function focus(options?: FocusOptions) {
  inputRef.value?.focus(options);
}

function blur() {
  inputRef.value?.blur();
}

function select() {
  inputRef.value?.select();
}

defineExpose({
  focus,
  blur,
  select,
});
</script>

<template>
  <input
    ref="inputRef"
    class="app-input-search"
    :style="inputStyle"
    type="search"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :name="name"
    :autocomplete="autocomplete"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-describedby="ariaDescribedby"
    autocapitalize="none"
    spellcheck="false"
    enterkeyhint="search"
    @input="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<style scoped>
.app-input-search {
  display: block;
  width: var(--cp-input-search-width);
  max-width: var(--cp-input-search-max-width);
  min-width: 0;
  box-sizing: border-box;
  padding: var(--cp-input-search-padding-y) var(--cp-input-search-padding-x);
  border: var(--cp-input-search-border-width) var(--cp-input-search-border-style) var(--cp-input-search-border-color);
  border-radius: var(--cp-input-search-border-radius);
  background: var(--cp-input-search-background-color);
  color: var(--cp-input-search-text-color);
  font-family: inherit;
  font-size: var(--cp-input-search-font-size);
  font-weight: var(--cp-input-search-font-weight);
  line-height: var(--app-line-height-control);
  letter-spacing: var(--app-letter-spacing-normal);
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease,
    color 160ms ease;

  &::placeholder {
    color: var(--cp-input-search-placeholder-color);
    opacity: 1;
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button {
    display: none;
    -webkit-appearance: none;
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 var(--app-border-width-medium) var(--app-color-primary);
  }

  &:disabled {
    background: var(--app-color-surface-secondary);
    color: var(--app-color-text-disabled);
    cursor: default;
  }
}

@media (hover: hover) and (pointer: fine) {
  .app-input-search:not(:disabled):hover {
    border-color: var(--app-color-primary);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-input-search {
    transition: none;
  }
}
</style>
