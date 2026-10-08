<script setup lang="ts">
import type { PropsWidth } from '@/app/shared/types/props/dimensions.props';
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import type { PropsDisabled, PropsSelectionFeedback } from '@/app/shared/types/props/interaction.props';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useResizeObserver } from '@/app/shared/composables/dom/useResizeObserver';
import { useSelectionFeedback } from '@/app/shared/composables/interaction/useSelectionFeedback';
import { LibStyle } from '@/core/lib/style';
import type { tStyleSizeValue } from '@/core/lib/style';
import type { tBaseSizeVariant } from '@/app/shared/styles/contracts/base';
import { resolveColorValue, type tColorValue } from '@/app/shared/styles/contracts/color.contract';
import { resolveSpaceValue, type tSpaceValue } from '@/app/shared/styles/contracts/space.contract';
import { LibNumber } from '@/core/lib/number';
import { LibScheduler } from '@/core/lib/scheduler';

export interface PropsAppSlider extends PropsWidth, PropsSizeVariant, PropsDisabled, PropsSelectionFeedback {
  modelValue: number;
  count: number;
  itemWidth?: tStyleSizeValue;
  itemMaxWidth?: tStyleSizeValue;
  itemGap?: tSpaceValue;
  inactiveScale?: number;
  inactiveOpacity?: number;
  viewportBleed?: tSpaceValue;
  contentDotsGap?: tSpaceValue;
  dotsHintGap?: tSpaceValue;
  dotsGap?: tSpaceValue;
  dotSize?: tStyleSizeValue;
  dotColor?: tColorValue;
  activeDotColor?: tColorValue;
  wheel?: boolean;
  accessibilityLabel: string;
  itemAccessibilityLabel: (index: number, count: number) => string;
}

const props = withDefaults(defineProps<PropsAppSlider>(), {
  size: 'middle',
  width: '100%',
  maxWidth: '100%',
  itemWidth: '70%',
  itemMaxWidth: '100%',
  itemGap: 6,
  inactiveScale: 0.88,
  inactiveOpacity: 0.45,
  viewportBleed: 0,
  contentDotsGap: undefined,
  dotsHintGap: 12,
  dotsGap: 6,
  dotSize: '1rem',
  dotColor: 'border-strong',
  activeDotColor: 'primary',
  wheel: true,
  disabled: false,
  sound: 'sfx.selection.shift',
  vibration: true,
});

const { triggerSelectionFeedback } = useSelectionFeedback(props);

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

defineSlots<{
  item(props: { index: number; active: boolean }): unknown;

  hint?(props: { wheelEnabled: boolean; canNavigate: boolean }): unknown;
}>();

const SIZE_MAP: Record<
  tBaseSizeVariant,
  {
    contentDotsGap: tSpaceValue;
    dotsHintGap: tSpaceValue;
    dotsGap: tSpaceValue;
  }
> = {
  small: {
    contentDotsGap: 4,
    dotsHintGap: 2,
    dotsGap: 2,
  },
  middle: {
    contentDotsGap: 6,
    dotsHintGap: 3,
    dotsGap: 3,
  },
  big: {
    contentDotsGap: 8,
    dotsHintGap: 4,
    dotsGap: 4,
  },
};

const DRAG_START_THRESHOLD = 12;

const viewportElement = ref<HTMLElement | null>(null);
const trackElement = ref<HTMLElement | null>(null);
const trackTranslate = ref(0);
const dragOffset = ref(0);
const activeItemWidth = ref(0);
const isDragging = ref(false);

let activePointerId: number | null = null;
let pointerStartX = 0;
let pointerMoved = false;
const dragFrame = LibScheduler.createAnimationFrame();
const positionFrame = LibScheduler.createAnimationFrame();
const wheelResetTimer = LibScheduler.createTimeout();

let wheelGestureActive = false;

const sizeConfig = computed(() => SIZE_MAP[props.size]);
const indexes = computed(() => Array.from({ length: Math.max(0, props.count) }, (_, index) => index));
const maxIndex = computed(() => Math.max(0, props.count - 1));
const activeIndex = computed(() => LibNumber.clamp(props.modelValue, 0, maxIndex.value));

const sliderWidth = computed(() => LibStyle.toSizeValue(props.width));
const sliderMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));
const sliderItemWidth = computed(() => LibStyle.toSizeValue(props.itemWidth));
const sliderItemMaxWidth = computed(() => LibStyle.toSizeValue(props.itemMaxWidth));
const sliderItemGap = computed(() => resolveSpaceValue(props.itemGap));
const sliderContentDotsGap = computed(() => resolveSpaceValue(props.contentDotsGap ?? sizeConfig.value.contentDotsGap));
const sliderDotsHintGap = computed(() => resolveSpaceValue(props.dotsHintGap ?? sizeConfig.value.dotsHintGap));
const sliderDotsGap = computed(() => resolveSpaceValue(props.dotsGap ?? sizeConfig.value.dotsGap));
const sliderDotSize = computed(() => LibStyle.toSizeValue(props.dotSize));
const sliderDotColor = computed(() => resolveColorValue(props.dotColor));
const sliderActiveDotColor = computed(() => resolveColorValue(props.activeDotColor));
const sliderInactiveScale = computed(() => LibNumber.clamp(props.inactiveScale, 0, 1));
const sliderInactiveOpacity = computed(() => LibNumber.clamp(props.inactiveOpacity, 0, 1));
const sliderViewportClipPath = computed(() => {
  const bleed = resolveSpaceValue(props.viewportBleed) ?? '0px';

  return `inset(calc(0px - ${bleed}) 0 calc(0px - ${bleed}) 0)`;
});

const trackTransform = computed(() => `translate3d(${trackTranslate.value + dragOffset.value}px, 0, 0)`);

function isItemActive(index: number) {
  return index === activeIndex.value;
}

function setActiveIndex(index: number) {
  if (props.disabled) {
    return;
  }

  const nextIndex = LibNumber.clamp(index, 0, maxIndex.value);

  if (nextIndex === activeIndex.value) {
    return;
  }

  emit('update:modelValue', nextIndex);

  triggerSelectionFeedback();
}

function getActiveItemElement() {
  const track = trackElement.value;

  if (!track) {
    return null;
  }

  return track.children[activeIndex.value] as HTMLElement | undefined;
}

async function updateTrackPosition() {
  await nextTick();

  positionFrame.request(() => {
    const viewport = viewportElement.value;
    const activeItem = getActiveItemElement();

    if (!viewport || !activeItem) {
      trackTranslate.value = 0;
      activeItemWidth.value = 0;
      return;
    }

    activeItemWidth.value = activeItem.offsetWidth;

    const itemCenter = activeItem.offsetLeft + activeItem.offsetWidth / 2;
    const viewportCenter = viewport.clientWidth / 2;

    trackTranslate.value = viewportCenter - itemCenter;
  });
}

function resolveVisualDragOffset(offset: number) {
  const isFirst = activeIndex.value === 0;
  const isLast = activeIndex.value === maxIndex.value;

  if ((isFirst && offset > 0) || (isLast && offset < 0)) {
    return offset * 0.25;
  }

  return offset;
}

function updateDragOffset(offset: number) {
  dragFrame.request(() => {
    dragOffset.value = resolveVisualDragOffset(offset);
  });
}

function captureSliderPointer(pointerId: number) {
  const viewport = viewportElement.value;

  if (!viewport || viewport.hasPointerCapture(pointerId)) {
    return;
  }

  viewport.setPointerCapture(pointerId);
}

function releaseSliderPointer(pointerId: number) {
  const viewport = viewportElement.value;

  if (!viewport || !viewport.hasPointerCapture(pointerId)) {
    return;
  }

  viewport.releasePointerCapture(pointerId);
}

function resetPointerState() {
  dragFrame.cancel();

  activePointerId = null;
  pointerStartX = 0;
  isDragging.value = false;
  dragOffset.value = 0;
}

function handlePointerDown(event: PointerEvent) {
  if (props.disabled || props.count <= 1) {
    return;
  }

  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  activePointerId = event.pointerId;
  pointerStartX = event.clientX;
  pointerMoved = false;
}

function handlePointerMove(event: PointerEvent) {
  if (event.pointerId !== activePointerId) {
    return;
  }

  const offset = event.clientX - pointerStartX;

  if (!isDragging.value) {
    if (Math.abs(offset) < DRAG_START_THRESHOLD) {
      return;
    }

    isDragging.value = true;
    pointerMoved = true;
    captureSliderPointer(event.pointerId);
  }

  updateDragOffset(offset);
}

function handlePointerUp(event: PointerEvent) {
  if (event.pointerId !== activePointerId) {
    return;
  }

  if (!isDragging.value) {
    resetPointerState();
    return;
  }

  const offset = event.clientX - pointerStartX;
  const threshold = LibNumber.clamp(activeItemWidth.value * 0.18, 40, 96);

  let nextIndex = activeIndex.value;

  if (offset <= -threshold) {
    nextIndex++;
  } else if (offset >= threshold) {
    nextIndex--;
  }

  releaseSliderPointer(event.pointerId);
  resetPointerState();
  setActiveIndex(nextIndex);
}

function handlePointerCancel(event: PointerEvent) {
  if (event.pointerId !== activePointerId) {
    return;
  }

  releaseSliderPointer(event.pointerId);
  resetPointerState();
}

function handleClickCapture(event: MouseEvent) {
  if (!pointerMoved) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  pointerMoved = false;
}

function resetWheelGestureSoon() {
  wheelResetTimer.start(() => {
    wheelGestureActive = false;
  }, 180);
}

function handleWheel(event: WheelEvent) {
  if (props.disabled || !props.wheel || props.count <= 1) {
    return;
  }

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

  if (Math.abs(delta) < 4) {
    return;
  }

  if (wheelGestureActive) {
    event.preventDefault();
    resetWheelGestureSoon();
    return;
  }

  const direction = delta > 0 ? 1 : -1;
  const nextIndex = LibNumber.clamp(activeIndex.value + direction, 0, maxIndex.value);

  if (nextIndex === activeIndex.value) {
    return;
  }

  event.preventDefault();

  wheelGestureActive = true;
  setActiveIndex(nextIndex);
  resetWheelGestureSoon();
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    setActiveIndex(activeIndex.value - 1);
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    setActiveIndex(activeIndex.value + 1);
  }
}

watch([activeIndex, () => props.count, () => props.itemWidth, () => props.itemMaxWidth, () => props.itemGap], () => {
  updateTrackPosition();
});

useResizeObserver([viewportElement, trackElement], () => {
  updateTrackPosition();
});

onMounted(() => {
  updateTrackPosition();
});

onBeforeUnmount(() => {
  dragFrame.cancel();
  positionFrame.cancel();
  wheelResetTimer.cancel();
});
</script>

<template>
  <div
    class="app-slider"
    :class="{
      'app-slider--disabled': disabled,
      'app-slider--dragging': isDragging,
    }"
    role="region"
    :aria-label="accessibilityLabel"
  >
    <div
      ref="viewportElement"
      class="app-slider__viewport"
      :tabindex="disabled ? -1 : 0"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerCancel"
      @click.capture="handleClickCapture"
      @wheel="handleWheel"
      @keydown="handleKeydown"
    >
      <div class="app-slider__viewport-clip">
        <div ref="trackElement" class="app-slider__track" :style="{ transform: trackTransform }">
          <div
            v-for="index in indexes"
            :key="index"
            class="app-slider__item"
            :class="{ 'app-slider__item--active': isItemActive(index) }"
            role="group"
            :aria-label="itemAccessibilityLabel(index, count)"
            :aria-hidden="!isItemActive(index)"
          >
            <div class="app-slider__item-content">
              <slot name="item" :index="index" :active="isItemActive(index)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="app-slider__footer">
      <div class="app-slider__dots" aria-hidden="true">
        <span v-for="index in indexes" :key="index" class="app-slider__dot" :class="{ 'app-slider__dot--active': isItemActive(index) }" />
      </div>

      <div v-if="$slots.hint" class="app-slider__hint">
        <slot name="hint" :wheel-enabled="wheel && count > 1" :can-navigate="count > 1" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: v-bind(sliderWidth);
  max-width: v-bind(sliderMaxWidth);
  min-width: 0;
  gap: v-bind(sliderContentDotsGap);
}

.app-slider__viewport {
  width: 100%;
  min-width: 0;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: var(--app-border-width-medium) var(--app-border-style-solid) var(--app-color-primary);
    outline-offset: 2px;
  }
}

.app-slider__viewport-clip {
  width: 100%;
  min-width: 0;
  clip-path: v-bind(sliderViewportClipPath);
}

.app-slider__track {
  display: flex;
  align-items: stretch;
  width: 100%;
  gap: v-bind(sliderItemGap);
  transition: transform var(--app-motion-duration-slower) var(--app-motion-ease-enter);
}

.app-slider__item {
  display: flex;
  flex: 0 0 v-bind(sliderItemWidth);
  width: v-bind(sliderItemWidth);
  max-width: v-bind(sliderItemMaxWidth);
  min-width: 0;
  opacity: v-bind(sliderInactiveOpacity);
  transform: scale(v-bind(sliderInactiveScale));
  transform-origin: center;
  pointer-events: none;
  transition:
    transform var(--app-motion-duration-slower) var(--app-motion-ease-enter),
    opacity var(--app-motion-duration-slow) var(--app-motion-ease-default);

  &.app-slider__item--active {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }
}

.app-slider__item-content {
  display: flex;
  width: 100%;
  min-width: 0;
}

.app-slider__footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: v-bind(sliderDotsHintGap);
}

.app-slider__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: v-bind(sliderDotsGap);
}

.app-slider__dot {
  display: block;
  flex: 0 0 auto;
  width: v-bind(sliderDotSize);
  aspect-ratio: 1;
  border-radius: 50%;
  background: v-bind(sliderDotColor);
  transition:
    background-color var(--app-motion-duration-medium) var(--app-motion-ease-default),
    opacity var(--app-motion-duration-medium) var(--app-motion-ease-default);
}

.app-slider__dot--active {
  background: v-bind(sliderActiveDotColor);
}

.app-slider__hint {
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: 0;
}

.app-slider--dragging {
  .app-slider__viewport {
    cursor: grabbing;
  }

  .app-slider__track {
    will-change: transform;
    transition: none;
  }
}

.app-slider--disabled {
  .app-slider__viewport {
    cursor: default;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-slider__track,
  .app-slider__item,
  .app-slider__dot {
    transition: none;
  }
}
</style>
