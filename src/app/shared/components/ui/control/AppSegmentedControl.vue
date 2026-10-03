<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import AppMarqueeText from '@/app/shared/components/ui/text/AppMarqueeText.vue';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { CONTROL_SIZE_PRESET } from '@/app/styles/presets/control.preset';
import { resolvePaddingValue, type tPaddingValue } from '@/app/styles/contracts/padding.contract';
import { resolveRadiusValue, type tRadiusValue } from '@/app/styles/contracts/radius.contract';
import { ToolVibration } from '@/core/platform';
import { useResizeObserver } from '@/app/shared/composables/dom/useResizeObserver';

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

const controlRef = ref<HTMLElement | null>(null);
const parentRef = ref<HTMLElement | null>(null);
const hoveredOptionValue = ref<string | null>(null);
const focusedOptionValue = ref<string | null>(null);
const equalItemWidth = ref<number | null>(null);

const sizeConfig = computed(() => CONTROL_SIZE_PRESET[props.size]);
const controlWidth = computed(() => LibStyle.toSizeValue(props.width));
const controlMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));
const controlBorderRadius = computed(() => resolveRadiusValue(props.borderRadius));

const itemPaddingX = computed(() => resolvePaddingValue(props.paddingX ?? sizeConfig.value.paddingX));

const itemPaddingY = computed(() => resolvePaddingValue(props.paddingY ?? sizeConfig.value.paddingY));

const itemFontSize = computed(() => sizeConfig.value.fontSize);
const isContentWidth = computed(() => props.width === 'fit-content' || props.width === 'auto');
const hasEqualItemWidth = computed(() => equalItemWidth.value !== null);
const equalItemWidthValue = computed(() => (equalItemWidth.value === null ? undefined : `${equalItemWidth.value}px`));

async function updateItemLayout() {
  await nextTick();

  const control = controlRef.value;
  const parent = parentRef.value;

  if (!isContentWidth.value || !control || !parent || props.options.length === 0) {
    equalItemWidth.value = null;
    return;
  }

  const items = Array.from(control.querySelectorAll<HTMLElement>('.app-segmented-control__item'));

  if (items.length !== props.options.length) {
    equalItemWidth.value = null;
    return;
  }

  const naturalWidths = items.map((item) => {
    const text = item.querySelector<HTMLElement>('.app-marquee-text__content');
    const paddingMeasure = item.querySelector<HTMLElement>('.app-marquee-text__padding-measure');

    if (!text || !paddingMeasure) {
      return 0;
    }

    const paddingStyle = getComputedStyle(paddingMeasure);
    const paddingX = Number.parseFloat(paddingStyle.paddingLeft) || 0;

    return text.getBoundingClientRect().width + paddingX * 2;
  });

  const widestItemWidth = Math.max(...naturalWidths);

  if (widestItemWidth <= 0) {
    equalItemWidth.value = null;
    return;
  }

  const firstItem = items[0];

  if (!firstItem) {
    equalItemWidth.value = null;
    return;
  }

  const itemStyle = getComputedStyle(firstItem);

  const dividerWidth = Number.parseFloat(itemStyle.borderRightWidth) || 0;
  const controlStyle = getComputedStyle(control);
  const controlBorderWidth =
    (Number.parseFloat(controlStyle.borderLeftWidth) || 0) + (Number.parseFloat(controlStyle.borderRightWidth) || 0);

  const equalControlWidth =
    widestItemWidth * items.length + dividerWidth * Math.max(0, items.length - 1) + controlBorderWidth;

  let availableWidth = parent.getBoundingClientRect().width;
  const computedMaxWidth = controlStyle.maxWidth;

  if (computedMaxWidth.endsWith('px')) {
    availableWidth = Math.min(availableWidth, Number.parseFloat(computedMaxWidth));
  }

  equalItemWidth.value = equalControlWidth <= availableWidth + 1 ? widestItemWidth : null;
}

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

onMounted(() => {
  parentRef.value = controlRef.value?.parentElement ?? null;
  updateItemLayout();
});

useResizeObserver([controlRef, parentRef], () => {
  updateItemLayout();
});

watch(
  () => [
    props.options.map((option) => option.label).join('\u0000'),
    props.width,
    props.maxWidth,
    props.paddingX,
    props.size,
  ],
  () => {
    updateItemLayout();
  },
  { flush: 'post' },
);

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
  <div
    ref="controlRef"
    class="app-segmented-control"
    :class="{
      'app-segmented-control--disabled': disabled,
      'app-segmented-control--content-width': isContentWidth,
      'app-segmented-control--equal-items': hasEqualItemWidth,
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

.app-segmented-control__item {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  min-width: 0;
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
  flex: 0 1 auto;
}

.app-segmented-control--content-width.app-segmented-control--equal-items .app-segmented-control__item {
  flex: 0 0 v-bind(equalItemWidthValue);
}

.app-segmented-control__text {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.app-segmented-control--content-width .app-segmented-control__text {
  width: max-content;
}
</style>
