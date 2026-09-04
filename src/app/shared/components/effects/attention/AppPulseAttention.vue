<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  isActive?: boolean
  duration?: number
  scale?: number
}

const props = withDefaults(defineProps<Props>(), {
  isActive: true,
  duration: 2400,
  scale: 1.035,
});

function normalizeDuration(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, value);
}

function normalizeScale(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, value);
}

const pulseClass = computed(() => [
  'app-pulse-attention',
  { 'app-pulse-attention--active': props.isActive },
]);

const pulseStyle = computed(() => ({
  '--cp-pulse-attention-duration': `${normalizeDuration(props.duration)}ms`,
  '--cp-pulse-attention-scale': normalizeScale(props.scale),
}));
</script>

<template>
  <span
    :class="pulseClass"
    :style="pulseStyle"
  >
    <slot />
  </span>
</template>

<style scoped>
.app-pulse-attention {
  display: inline-flex;
  transform-origin: center;
}

.app-pulse-attention--active {
  animation: app-pulse-attention var(--cp-pulse-attention-duration) ease-in-out infinite;
  will-change: opacity, transform;
}

@media (prefers-reduced-motion: reduce) {
  .app-pulse-attention--active {
    animation: none;
  }
}

@keyframes app-pulse-attention {
  0%,
  100% {
    opacity: 0.62;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(var(--cp-pulse-attention-scale));
  }
}
</style>
