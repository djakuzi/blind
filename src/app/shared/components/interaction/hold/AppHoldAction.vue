<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

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
  releaseDuration?: number
  vibrationDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  actions: undefined,
  disabled: false,
  duration: 650,
  fillDuration: undefined,
  initialProgress: 15,
  releaseDuration: 140,
  vibrationDuration: 45,
});

const emit = defineEmits<{
  complete: []
}>();

const isHolding = ref(false);
const hasCompleted = ref(false);
const startedAt = ref(0);
let animationFrameId: number | undefined;
let activePointerId: number | undefined;
let activePointerTarget: HTMLElement | undefined;
let activeTouchId: number | undefined;

function normalizeProgressValue(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

const normalizedInitialProgress = computed(() => normalizeProgressValue(props.initialProgress));
const normalizedFillDuration = computed(() => Math.max(1, props.fillDuration ?? props.duration));
const normalizedReleaseDuration = computed(() => Math.max(0, props.releaseDuration));
const progress = ref(normalizedInitialProgress.value);
const normalizedProgress = computed(() => normalizeProgressValue(progress.value));
const progressRatio = computed(() => normalizedProgress.value / 100);
const isProgressActive = computed(() => (
  isHolding.value || normalizedProgress.value > normalizedInitialProgress.value
));

watch(normalizedInitialProgress, (initialProgress) => {
  if (isHolding.value) {
    return;
  }

  progress.value = initialProgress;
});

function stopProgressAnimation() {
  if (animationFrameId === undefined) {
    return;
  }

  cancelAnimationFrame(animationFrameId);
  animationFrameId = undefined;
}

function completeHold() {
  if (hasCompleted.value) {
    return;
  }

  hasCompleted.value = true;
  progress.value = 100;
  ToolVibration.vibrate({ duration: props.vibrationDuration });
  props.actions?.complete?.();
  emit('complete');
}

function updateProgress() {
  if (!isHolding.value) {
    return;
  }

  const duration = normalizedFillDuration.value;
  const elapsed = performance.now() - startedAt.value;
  const initialProgress = normalizedInitialProgress.value;
  progress.value = initialProgress + (elapsed / duration) * (100 - initialProgress);

  if (progress.value >= 100) {
    completeHold();
    stopProgressAnimation();

    return;
  }

  animationFrameId = requestAnimationFrame(updateProgress);
}

function beginHold() {
  if (isHolding.value) {
    return;
  }

  stopProgressAnimation();
  isHolding.value = true;
  hasCompleted.value = false;
  progress.value = normalizedInitialProgress.value;
  startedAt.value = performance.now();
  animationFrameId = requestAnimationFrame(updateProgress);
}

function animateReleaseProgress() {
  const startProgress = normalizedProgress.value;
  const finishProgress = normalizedInitialProgress.value;
  const startedAt = performance.now();
  const duration = normalizedReleaseDuration.value;

  if (startProgress <= finishProgress || duration <= 0) {
    progress.value = finishProgress;

    return;
  }

  function updateReleaseProgress() {
    const elapsed = performance.now() - startedAt;
    const releaseProgress = Math.min(1, elapsed / duration);
    progress.value = finishProgress + (startProgress - finishProgress) * (1 - releaseProgress);

    if (releaseProgress >= 1) {
      progress.value = finishProgress;
      animationFrameId = undefined;

      return;
    }

    animationFrameId = requestAnimationFrame(updateReleaseProgress);
  }

  animationFrameId = requestAnimationFrame(updateReleaseProgress);
}

function releasePointerCapture() {
  if (
    activePointerId !== undefined
    && activePointerTarget?.hasPointerCapture(activePointerId)
  ) {
    activePointerTarget.releasePointerCapture(activePointerId);
  }

  activePointerId = undefined;
  activePointerTarget = undefined;
}

function isHoldPointer(event: PointerEvent) {
  if (!event.isPrimary) {
    return false;
  }

  return event.pointerType !== 'mouse' || event.button === 0;
}

function startHold(event: PointerEvent) {
  if (props.disabled || !isHoldPointer(event)) {
    return;
  }

  event.preventDefault();

  const target = event.currentTarget;

  if (target instanceof HTMLElement) {
    if (typeof target.setPointerCapture === 'function') {
      target.setPointerCapture(event.pointerId);
    }

    activePointerId = event.pointerId;
    activePointerTarget = target;
  }

  beginHold();
}

function resetHoldState(isImmediate = false) {
  const shouldAnimateRelease = !isImmediate && progress.value > normalizedInitialProgress.value;

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

function resetPointerHold(event?: PointerEvent) {
  if (
    event !== undefined
    && activePointerId !== undefined
    && event.pointerId !== activePointerId
  ) {
    return;
  }

  resetHoldState();
}

function getActiveChangedTouch(event: TouchEvent) {
  if (activeTouchId === undefined) {
    return undefined;
  }

  return Array
    .from(event.changedTouches)
    .find((touch) => touch.identifier === activeTouchId);
}

function startTouchHold(event: TouchEvent) {
  const touch = event.changedTouches.item(0);

  if (props.disabled || touch === null) {
    return;
  }

  event.preventDefault();
  activeTouchId = touch.identifier;
  beginHold();
}

function resetTouchHold(event: TouchEvent) {
  if (activeTouchId === undefined || getActiveChangedTouch(event) === undefined) {
    return;
  }

  event.preventDefault();
  resetHoldState();
}

function startMouseHold(event: MouseEvent) {
  if (props.disabled || event.button !== 0) {
    return;
  }

  event.preventDefault();
  beginHold();
}

function resetMouseHold() {
  if (activePointerId !== undefined || activeTouchId !== undefined) {
    return;
  }

  resetHoldState();
}

onBeforeUnmount(() => resetHoldState(true));
</script>

<template>
  <div
    class="app-hold-action"
    @pointerdown="startHold"
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
  width: 100%;
  max-width: 100%;
  min-width: 0;
  touch-action: none;
  -webkit-touch-callout: none;
}
</style>
