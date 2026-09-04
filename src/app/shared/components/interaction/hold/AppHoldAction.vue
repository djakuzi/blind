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

function startHold(event: PointerEvent) {
  if (props.disabled || event.button !== 0) {
    return;
  }

  const target = event.currentTarget;

  if (target instanceof HTMLElement) {
    target.setPointerCapture(event.pointerId);
  }

  stopProgressAnimation();
  isHolding.value = true;
  hasCompleted.value = false;
  progress.value = 0;
  startedAt.value = performance.now();
  animationFrameId = requestAnimationFrame(updateProgress);
}

function resetHold() {
  stopProgressAnimation();
  isHolding.value = false;
  hasCompleted.value = false;
  progress.value = 0;
}

onBeforeUnmount(stopProgressAnimation);
</script>

<template>
  <div
    class="app-hold-action"
    @pointerdown="startHold"
    @pointerup="resetHold"
    @pointercancel="resetHold"
    @lostpointercapture="resetHold"
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
