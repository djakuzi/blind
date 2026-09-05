<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import { ToolVibration } from '@/core/tool/vibration';

interface iAppHoldActionActions {
  complete?: () => void
}

interface Props {
  actions?: iAppHoldActionActions
  disabled?: boolean
  duration?: number
  fillDuration?: number
  initialProgress?: number
  maxWidth?: tStyleSizeValue
  releaseDuration?: number
  vibrationDuration?: number
  width?: tStyleSizeValue
}

const props = withDefaults(defineProps<Props>(), {
  actions: undefined,
  disabled: false,
  duration: 650,
  fillDuration: undefined,
  initialProgress: 15,
  maxWidth: '100%',
  releaseDuration: 140,
  vibrationDuration: 45,
  width: '100%',
});

const emit = defineEmits<{
  complete: []
}>();

const isHolding = ref(false);
const hasCompleted = ref(false);
const progress = ref(0);

let holdStartedAt = 0;
let animationFrameId: number | undefined;

let activePointerId: number | undefined;
let activePointerTarget: HTMLElement | undefined;

let activeTouchId: number | undefined;

function normalizeProgressValue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

function getCurrentTime(): number {
  return performance.now();
}

function supportsPointerEvents(): boolean {
  return typeof globalThis.PointerEvent !== 'undefined';
}

const normalizedInitialProgress = computed(() => (
  normalizeProgressValue(props.initialProgress)
));

const normalizedFillDuration = computed(() => (
  Math.max(1, props.fillDuration ?? props.duration)
));

const normalizedReleaseDuration = computed(() => (
  Math.max(0, props.releaseDuration)
));

const normalizedProgress = computed(() => (
  normalizeProgressValue(progress.value)
));

const progressRatio = computed(() => (
  normalizedProgress.value / 100
));

const isProgressActive = computed(() => (
  isHolding.value
  || normalizedProgress.value > normalizedInitialProgress.value
));

const holdActionStyle = computed(() => ({
  '--cp-hold-action-width': LibStyle.toSizeValue(props.width) ?? 'auto',
  '--cp-hold-action-max-width': LibStyle.toSizeValue(props.maxWidth) ?? 'none',
}));

progress.value = normalizedInitialProgress.value;

watch(normalizedInitialProgress, (initialProgress) => {
  if (isHolding.value) {
    return;
  }

  progress.value = initialProgress;
});

function stopProgressAnimation(): void {
  if (animationFrameId === undefined) {
    return;
  }

  cancelAnimationFrame(animationFrameId);
  animationFrameId = undefined;
}

function requestProgressAnimation(callback: FrameRequestCallback): void {
  stopProgressAnimation();
  animationFrameId = requestAnimationFrame(callback);
}

function completeHold(): void {
  if (hasCompleted.value) {
    return;
  }

  hasCompleted.value = true;
  progress.value = 100;

  void ToolVibration.vibrate({
    duration: props.vibrationDuration,
  });

  props.actions?.complete?.();
  emit('complete');
}

function updateHoldProgress(): void {
  if (!isHolding.value) {
    animationFrameId = undefined;
    return;
  }

  const elapsed = getCurrentTime() - holdStartedAt;
  const initialProgress = normalizedInitialProgress.value;
  const duration = normalizedFillDuration.value;

  progress.value = (
    initialProgress
    + (elapsed / duration) * (100 - initialProgress)
  );

  if (progress.value >= 100) {
    completeHold();
    stopProgressAnimation();
    return;
  }

  animationFrameId = requestAnimationFrame(updateHoldProgress);
}

function beginHold(): void {
  if (isHolding.value) {
    return;
  }

  stopProgressAnimation();

  isHolding.value = true;
  hasCompleted.value = false;
  progress.value = normalizedInitialProgress.value;
  holdStartedAt = getCurrentTime();

  animationFrameId = requestAnimationFrame(updateHoldProgress);
}

function animateReleaseProgress(): void {
  const startProgress = normalizedProgress.value;
  const finishProgress = normalizedInitialProgress.value;
  const duration = normalizedReleaseDuration.value;

  if (startProgress <= finishProgress || duration <= 0) {
    progress.value = finishProgress;
    return;
  }

  const releaseStartedAt = getCurrentTime();

  function updateReleaseProgress(): void {
    const elapsed = getCurrentTime() - releaseStartedAt;
    const releaseProgress = Math.min(1, elapsed / duration);

    progress.value = (
      finishProgress
      + (startProgress - finishProgress) * (1 - releaseProgress)
    );

    if (releaseProgress >= 1) {
      progress.value = finishProgress;
      animationFrameId = undefined;
      return;
    }

    animationFrameId = requestAnimationFrame(updateReleaseProgress);
  }

  requestProgressAnimation(updateReleaseProgress);
}

function releasePointerCapture(): void {
  const pointerId = activePointerId;
  const pointerTarget = activePointerTarget;

  activePointerId = undefined;
  activePointerTarget = undefined;

  if (
    pointerId === undefined
    || pointerTarget === undefined
    || typeof pointerTarget.hasPointerCapture !== 'function'
    || typeof pointerTarget.releasePointerCapture !== 'function'
  ) {
    return;
  }

  if (!pointerTarget.hasPointerCapture(pointerId)) {
    return;
  }

  pointerTarget.releasePointerCapture(pointerId);
}

function resetHoldState(isImmediate = false): void {
  const shouldAnimateRelease = (
    !isImmediate
    && progress.value > normalizedInitialProgress.value
  );

  stopProgressAnimation();

  isHolding.value = false;
  hasCompleted.value = false;
  activeTouchId = undefined;

  releasePointerCapture();

  if (shouldAnimateRelease) {
    animateReleaseProgress();
    return;
  }

  progress.value = normalizedInitialProgress.value;
}

function isHoldPointer(event: PointerEvent): boolean {
  if (!event.isPrimary) {
    return false;
  }

  if (event.pointerType === 'mouse') {
    return event.button === 0;
  }

  return true;
}

function capturePointer(event: PointerEvent): void {
  const target = event.currentTarget;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (typeof target.setPointerCapture === 'function') {
    target.setPointerCapture(event.pointerId);
  }

  activePointerId = event.pointerId;
  activePointerTarget = target;
}

function startPointerHold(event: PointerEvent): void {
  if (props.disabled || !isHoldPointer(event)) {
    return;
  }

  event.preventDefault();

  capturePointer(event);
  beginHold();
}

function resetPointerHold(event?: PointerEvent): void {
  if (
    event !== undefined
    && activePointerId !== undefined
    && event.pointerId !== activePointerId
  ) {
    return;
  }

  resetHoldState();
}

function getActiveChangedTouch(event: TouchEvent): Touch | undefined {
  if (activeTouchId === undefined) {
    return undefined;
  }

  return Array
    .from(event.changedTouches)
    .find((touch) => touch.identifier === activeTouchId);
}

function startTouchHold(event: TouchEvent): void {
  if (supportsPointerEvents() || props.disabled) {
    return;
  }

  const touch = event.changedTouches.item(0);

  if (touch === null) {
    return;
  }

  event.preventDefault();

  activeTouchId = touch.identifier;
  beginHold();
}

function resetTouchHold(event: TouchEvent): void {
  if (supportsPointerEvents()) {
    return;
  }

  if (
    activeTouchId === undefined
    || getActiveChangedTouch(event) === undefined
  ) {
    return;
  }

  event.preventDefault();
  resetHoldState();
}

function startMouseHold(event: MouseEvent): void {
  if (
    supportsPointerEvents()
    || props.disabled
    || event.button !== 0
  ) {
    return;
  }

  event.preventDefault();
  beginHold();
}

function resetMouseHold(): void {
  if (supportsPointerEvents()) {
    return;
  }

  if (activeTouchId !== undefined) {
    return;
  }

  resetHoldState();
}

onBeforeUnmount(() => {
  resetHoldState(true);
});
</script>

<template>
  <div
    class="app-hold-action"
    :style="holdActionStyle"
    @pointerdown="startPointerHold"
    @pointerup="resetPointerHold"
    @pointercancel="resetPointerHold"
    @lostpointercapture="resetPointerHold"
    @touchstart="startTouchHold"
    @touchend="resetTouchHold"
    @touchcancel="resetTouchHold"
    @mousedown="startMouseHold"
    @mouseup="resetMouseHold"
    @mouseleave="resetMouseHold"
    @contextmenu.prevent
  >
    <slot
      :progress="normalizedProgress"
      :progress-ratio="progressRatio"
      :is-holding="isHolding"
      :is-progress-active="isProgressActive"
      :is-complete="hasCompleted"
    />
  </div>
</template>

<style scoped>
.app-hold-action {
  display: inline-flex;
  width: var(--cp-hold-action-width);
  max-width: var(--cp-hold-action-max-width);
  min-width: 0;
  touch-action: none;
  -webkit-touch-callout: none;
}
</style>