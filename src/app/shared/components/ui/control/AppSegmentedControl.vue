<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppMarqueeText from '@/app/shared/components/ui/text/AppMarqueeText.vue';
import { useAudio } from '@/app/shared/composables/audio/useAudio';
import { useResizeObserver } from '@/app/shared/composables/dom/useResizeObserver';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { CONTROL_SIZE_PRESET } from '@/app/styles/presets/control.preset';
import { resolvePaddingValue, type tPaddingValue } from '@/app/styles/contracts/padding.contract';
import { resolveRadiusValue, type tRadiusValue } from '@/app/styles/contracts/radius.contract';
import type { tAudioId } from '@/core/media/audio';
import { ToolVibration } from '@/core/platform';

type tSegmentedContentLayout = 'pending' | 'equal' | 'adaptive';

export interface iAppSegmentedControlOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface PropsAppSegmentedControl {
  modelValue: string;
  options: readonly iAppSegmentedControlOption[];
  disabled?: boolean;
  sound?: tAudioId | null;
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
  sound: 'sfx.ui.selection',
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

const controlRef = ref<HTMLElement | null>(null);
const parentRef = ref<HTMLElement | null>(null);
const measureRef = ref<HTMLElement | null>(null);
const hoveredOptionValue = ref<string | null>(null);
const focusedOptionValue = ref<string | null>(null);
const contentLayout = ref<tSegmentedContentLayout>('pending');
const equalItemWidth = ref<number | null>(null);

let canUpdateItemLayout = false;

const sizeConfig = computed(() => CONTROL_SIZE_PRESET[props.size]);
const controlWidth = computed(() => LibStyle.toSizeValue(props.width));
const controlMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));
const controlBorderRadius = computed(() => resolveRadiusValue(props.borderRadius));

const itemPaddingX = computed(() => resolvePaddingValue(props.paddingX ?? sizeConfig.value.paddingX));

const itemPaddingY = computed(() => resolvePaddingValue(props.paddingY ?? sizeConfig.value.paddingY));

const itemFontSize = computed(() => sizeConfig.value.fontSize);
const isContentWidth = computed(() => props.width === 'fit-content' || props.width === 'auto');
const isContentLayoutReady = computed(() => !isContentWidth.value || contentLayout.value !== 'pending');
const hasEqualItems = computed(() => isContentWidth.value && contentLayout.value === 'equal');
const equalItemWidthValue = computed(() => (equalItemWidth.value === null ? undefined : `${equalItemWidth.value}px`));

function waitForLayoutFrame() {
  if (typeof requestAnimationFrame === 'undefined') {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

async function updateItemLayout() {
  if (!canUpdateItemLayout) {
    return;
  }

  if (!isContentWidth.value) {
    equalItemWidth.value = null;
    contentLayout.value = 'adaptive';
    return;
  }

  await nextTick();

  const control = controlRef.value;
  const parent = parentRef.value;
  const measure = measureRef.value;

  if (!control || !parent || !measure || props.options.length === 0) {
    equalItemWidth.value = null;
    contentLayout.value = 'adaptive';
    return;
  }

  const measureItems = Array.from(
    measure.querySelectorAll<HTMLElement>('.app-segmented-control__measure-item'),
  );

  if (measureItems.length !== props.options.length) {
    equalItemWidth.value = null;
    contentLayout.value = 'adaptive';
    return;
  }

  const widestMeasuredItem = Math.max(
    ...measureItems.map((item) => item.getBoundingClientRect().width),
  );

  const firstVisibleItem = control.querySelector<HTMLElement>('.app-segmented-control__item');

  if (widestMeasuredItem <= 0 || !firstVisibleItem) {
    equalItemWidth.value = null;
    contentLayout.value = 'adaptive';
    return;
  }

  const itemStyle = getComputedStyle(firstVisibleItem);
  const dividerWidth = Number.parseFloat(itemStyle.borderRightWidth) || 0;
  const controlStyle = getComputedStyle(control);
  const controlBorderWidth =
    (Number.parseFloat(controlStyle.borderLeftWidth) || 0) +
    (Number.parseFloat(controlStyle.borderRightWidth) || 0);

  const equalItemOuterWidth = Math.ceil(widestMeasuredItem + dividerWidth);
  const equalControlWidth = equalItemOuterWidth * props.options.length + controlBorderWidth;

  let availableWidth = parent.getBoundingClientRect().width;
  const computedMaxWidth = controlStyle.maxWidth;

  if (computedMaxWidth.endsWith('px')) {
    availableWidth = Math.min(availableWidth, Number.parseFloat(computedMaxWidth));
  }

  if (equalControlWidth <= availableWidth + 1) {
    equalItemWidth.value = equalItemOuterWidth;
    contentLayout.value = 'equal';
    return;
  }

  equalItemWidth.value = null;
  contentLayout.value = 'adaptive';
}

async function initializeItemLayout() {
  parentRef.value = controlRef.value?.parentElement ?? null;

  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready;
  }

  await nextTick();
  await waitForLayoutFrame();
  await waitForLayoutFrame();

  canUpdateItemLayout = true;
  await updateItemLayout();
}

function resetItemLayout() {
  if (!isContentWidth.value) {
    equalItemWidth.value = null;
    contentLayout.value = 'adaptive';
    updateItemLayout();
    return;
  }

  equalItemWidth.value = null;
  contentLayout.value = 'pending';
  updateItemLayout();
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
  initializeItemLayout();
});

useResizeObserver([parentRef], () => {
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
    resetItemLayout();
  },
  { flush: 'post' },
);

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
    ref="controlRef"
    class="app-segmented-control"
    :class="{
      'app-segmented-control--disabled': disabled,
      'app-segmented-control--content-width': isContentWidth,
      'app-segmented-control--layout-ready': isContentLayoutReady,
      'app-segmented-control--equal-items': hasEqualItems,
    }"
    role="radiogroup"
  >
    <div ref="measureRef" class="app-segmented-control__measure" aria-hidden="true">
      <span
        v-for="option in options"
        :key="`measure-${option.value}`"
        class="app-segmented-control__measure-item"
      >
        <AppText
          :text="option.label"
          tag="span"
          color="inherit"
          :font-size="itemFontSize"
          font-weight="bold"
          :uppercase="true"
        />
      </span>
    </div>

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
  position: relative;
  display: inline-flex;
  width: v-bind(controlWidth);
  max-width: v-bind(controlMaxWidth);
  min-width: 0;
  border: var(--app-border-width-thick) var(--app-border-style-solid) var(--app-color-border-contrast);
  border-radius: v-bind(controlBorderRadius);
  overflow: hidden;
}

.app-segmented-control--content-width:not(.app-segmented-control--layout-ready) {
  visibility: hidden;
}

.app-segmented-control__measure {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: max-content;
  height: 0;
  visibility: hidden;
  pointer-events: none;
}

.app-segmented-control__measure-item {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  box-sizing: border-box;
  padding-inline: v-bind(itemPaddingX);
  white-space: nowrap;
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
  flex: 0 1 auto;
}

.app-segmented-control--content-width.app-segmented-control--equal-items {
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: v-bind(equalItemWidthValue);
}

.app-segmented-control--content-width.app-segmented-control--equal-items .app-segmented-control__item {
  width: 100%;
}

.app-segmented-control__text {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.app-segmented-control--content-width:not(.app-segmented-control--equal-items) .app-segmented-control__text {
  width: max-content;
  max-width: 100%;
}
</style>
