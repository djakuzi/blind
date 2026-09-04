<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

interface iAppHoldActionActions {
  complete?: () => void
}

interface Props {
  actions?: iAppHoldActionActions
  disabled?: boolean
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  actions: undefined,
  disabled: false,
  duration: 900,
});

const emit = defineEmits<{
  complete: []
}>();

const isHolding = ref(false);
const hasCompleted = ref(false);
const startedAt = ref(0);
const progress = ref(0);
let animationFrameId: number | undefined;
let activePointerId: number | undefined;
let activePointerTarget: HTMLElement | undefined;
let activeTouchId: number | undefined;

const normalizedProgress = computed(() => Math.min(100, Math.max(0, progress.value)));

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
  props.actions?.complete?.();
  emit('complete');
}

function updateProgress() {
  if (!isHolding.value) {
    return;
  }

  const duration = Math.max(1, props.duration);
  const elapsed = performance.now() - startedAt.value;
  progress.value = (elapsed / duration) * 100;

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
  progress.value = 0;
  startedAt.value = performance.now();
  animationFrameId = requestAnimationFrame(updateProgress);
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

  const target = event.target;

  if (target instanceof HTMLElement) {
    target.setPointerCapture(event.pointerId);
    activePointerId = event.pointerId;
    activePointerTarget = target;
  }

  beginHold();
}

function resetHoldState() {
  stopProgressAnimation();
  isHolding.value = false;
  hasCompleted.value = false;
  progress.value = 0;
  activeTouchId = undefined;
  releasePointerCapture();
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

onBeforeUnmount(resetHoldState);
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
      :is-holding="isHolding"
      :is-complete="hasCompleted"
    />
  </div>
</template>

<style scoped>
.app-hold-action {
  display: contents;
}
</style>
