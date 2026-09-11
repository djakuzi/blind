<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';
import { resolveColorValue, type tColorValue } from '@/app/styles/contracts/color.contract';
import { resolveSpaceValue, type tSpaceValue } from '@/app/styles/contracts/space.contract';

export interface PropsAppSlider {
  modelValue: number
  count: number
  size?: tBaseSizeVariant
  width?: tStyleSizeValue
  maxWidth?: tStyleSizeValue
  itemWidth?: tStyleSizeValue
  itemMaxWidth?: tStyleSizeValue
  itemGap?: tSpaceValue
  inactiveScale?: number
  inactiveOpacity?: number
  contentDotsGap?: tSpaceValue
  dotsHintGap?: tSpaceValue
  dotsGap?: tSpaceValue
  dotSize?: tStyleSizeValue
  dotColor?: tColorValue
  activeDotColor?: tColorValue
  wheel?: boolean
  disabled?: boolean
  accessibilityLabel?: string
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
  contentDotsGap: undefined,
  dotsHintGap: 12,
  dotsGap: 6,
  dotSize: '1rem',
  dotColor: 'border-strong',
  activeDotColor: 'primary',
  wheel: true,
  disabled: false,
  accessibilityLabel: 'Слайдер',
});

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>();

defineSlots<{
  item(props: {
    index: number
    active: boolean
  }): unknown

  hint?(props: {
    wheelEnabled: boolean
    canNavigate: boolean
  }): unknown
}>();

const SIZE_MAP: Record<tBaseSizeVariant, {
  contentDotsGap: tSpaceValue
  dotsHintGap: tSpaceValue
  dotsGap: tSpaceValue
}> = {
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
let dragFrameId: number | null = null;
let positionFrameId: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let wheelGestureActive = false;
let wheelResetTimer: number | null = null;

const sizeConfig = computed(() => SIZE_MAP[props.size]);
const indexes = computed(() => Array.from({ length: Math.max(0, props.count) }, (_, index) => index));
const maxIndex = computed(() => Math.max(0, props.count - 1));
const activeIndex = computed(() => Math.min(Math.max(props.modelValue, 0), maxIndex.value));

const sliderWidth = computed(() => LibStyle.toSizeValue(props.width));
const sliderMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));
const sliderItemWidth = computed(() => LibStyle.toSizeValue(props.itemWidth));
const sliderItemMaxWidth = computed(() => LibStyle.toSizeValue(props.itemMaxWidth));
const sliderItemGap = computed(() => resolveSpaceValue(props.itemGap));
const sliderContentDotsGap = computed(() => resolveSpaceValue(
  props.contentDotsGap ?? sizeConfig.value.contentDotsGap,
));
const sliderDotsHintGap = computed(() => resolveSpaceValue(
  props.dotsHintGap ?? sizeConfig.value.dotsHintGap,
));
const sliderDotsGap = computed(() => resolveSpaceValue(
  props.dotsGap ?? sizeConfig.value.dotsGap,
));
const sliderDotSize = computed(() => LibStyle.toSizeValue(props.dotSize));
const sliderDotColor = computed(() => resolveColorValue(props.dotColor));
const sliderActiveDotColor = computed(() => resolveColorValue(props.activeDotColor));
const sliderInactiveScale = computed(() => Math.min(1, Math.max(0, props.inactiveScale)));
const sliderInactiveOpacity = computed(() => Math.min(1, Math.max(0, props.inactiveOpacity)));

const trackTransform = computed(() =>
  `translate3d(${trackTranslate.value + dragOffset.value}px, 0, 0)`,
);

function isItemActive(index: number) {
  return index === activeIndex.value;
}

function setActiveIndex(index: number) {
  if (props.disabled) {
    return;
  }

  const nextIndex = Math.min(Math.max(index, 0), maxIndex.value);

  if (nextIndex === activeIndex.value) {
    return;
  }

  emit('update:modelValue', nextIndex);
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

  if (positionFrameId !== null) {
    cancelAnimationFrame(positionFrameId);
  }

  positionFrameId = requestAnimationFrame(() => {
    positionFrameId = null;

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

function cancelDragFrame() {
  if (dragFrameId === null) {
    return;
  }

  cancelAnimationFrame(dragFrameId);
  dragFrameId = null;
}

function updateDragOffset(offset: number) {
  cancelDragFrame();

  dragFrameId = requestAnimationFrame(() => {
    dragFrameId = null;
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
  cancelDragFrame();

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
  const threshold = Math.max(40, Math.min(activeItemWidth.value * 0.18, 96));

  let nextIndex = activeIndex.value;

  if (offset <= -threshold) {
    nextIndex++;
  }
  else if (offset >= threshold) {
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
  if (wheelResetTimer !== null) {
    window.clearTimeout(wheelResetTimer);
  }

  wheelResetTimer = window.setTimeout(() => {
    wheelGestureActive = false;
    wheelResetTimer = null;
  }, 180);
}

function handleWheel(event: WheelEvent) {
  if (props.disabled || !props.wheel || props.count <= 1) {
    return;
  }

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
    ? event.deltaX
    : event.deltaY;

  if (Math.abs(delta) < 4) {
    return;
  }

  if (wheelGestureActive) {
    event.preventDefault();
    resetWheelGestureSoon();
    return;
  }

  const direction = delta > 0 ? 1 : -1;
  const nextIndex = Math.min(Math.max(activeIndex.value + direction, 0), maxIndex.value);

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

watch(
  [
    activeIndex,
    () => props.count,
    () => props.itemWidth,
    () => props.itemMaxWidth,
    () => props.itemGap,
  ],
  () => {
    void updateTrackPosition();
  },
);

onMounted(() => {
  void updateTrackPosition();

  resizeObserver = new ResizeObserver(() => {
    void updateTrackPosition();
  });

  if (viewportElement.value) {
    resizeObserver.observe(viewportElement.value);
  }

  if (trackElement.value) {
    resizeObserver.observe(trackElement.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  cancelDragFrame();

  if (positionFrameId !== null) {
    cancelAnimationFrame(positionFrameId);
  }

  if (wheelResetTimer !== null) {
    window.clearTimeout(wheelResetTimer);
  }
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
    aria-roledescription="carousel"
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
      <div
        ref="trackElement"
        class="app-slider__track"
        :style="{ transform: trackTransform }"
      >
        <div
          v-for="index in indexes"
          :key="index"
          class="app-slider__item"
          :class="{ 'app-slider__item--active': isItemActive(index) }"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${index + 1} из ${count}`"
          :aria-hidden="!isItemActive(index)"
        >
          <div class="app-slider__item-content">
            <slot
              name="item"
              :index="index"
              :active="isItemActive(index)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="app-slider__footer">
      <div
        class="app-slider__dots"
        aria-hidden="true"
      >
        <span
          v-for="index in indexes"
          :key="index"
          class="app-slider__dot"
          :class="{ 'app-slider__dot--active': isItemActive(index) }"
        />
      </div>

      <div
        v-if="$slots.hint"
        class="app-slider__hint"
      >
        <slot
          name="hint"
          :wheel-enabled="wheel && count > 1"
          :can-navigate="count > 1"
        />
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
  overflow: hidden;
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

.app-slider__track {
  display: flex;
  align-items: center;
  width: 100%;
  gap: v-bind(sliderItemGap);
  will-change: transform;
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.app-slider__item {
  flex: 0 0 v-bind(sliderItemWidth);
  width: v-bind(sliderItemWidth);
  max-width: v-bind(sliderItemMaxWidth);
  min-width: 0;
  opacity: v-bind(sliderInactiveOpacity);
  transform: scale(v-bind(sliderInactiveScale));
  transform-origin: center;
  pointer-events: none;
  will-change: transform, opacity;
  transition:
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 220ms ease;

  &.app-slider__item--active {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }
}

.app-slider__item-content {
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
    background-color 180ms ease,
    opacity 180ms ease;
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