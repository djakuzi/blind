<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  flowBackDuration?: number
  flowFrontDuration?: number
  isActive?: boolean
  progressRatio?: number
}

const props = withDefaults(defineProps<Props>(), {
  flowBackDuration: 3000,
  flowFrontDuration: 1800,
  isActive: false,
  progressRatio: 0,
});

function normalizeProgressRatio(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function normalizeDuration(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, value);
}

const fillStyle = computed(() => {
  const progressRatio = normalizeProgressRatio(props.progressRatio);

  return {
    '--cp-blood-fill-offset': `${(1 - progressRatio) * 100}%`,
    '--cp-blood-fill-back-duration': `${normalizeDuration(props.flowBackDuration)}ms`,
    '--cp-blood-fill-front-duration': `${normalizeDuration(props.flowFrontDuration)}ms`,
  };
});

const fillClass = computed(() => [
  'app-blood-fill',
  { 'app-blood-fill--active': props.isActive },
]);
</script>

<template>
  <span
    :class="fillClass"
    :style="fillStyle"
    aria-hidden="true"
  >
    <span class="app-blood-fill__body" />
    <svg
      class="app-blood-fill__wave app-blood-fill__wave--back"
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      focusable="false"
    >
      <path d="M0 38 C54 28 95 43 146 36 C214 25 260 48 326 39 C398 29 455 37 519 43 C585 50 642 28 698 36 C706 37 714 38 720 38 C774 28 815 43 866 36 C934 25 980 48 1046 39 C1118 29 1175 37 1239 43 C1305 50 1362 28 1418 36 C1426 37 1434 38 1440 38 L1440 90 L0 90 Z" />
    </svg>
    <svg
      class="app-blood-fill__wave app-blood-fill__wave--front"
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      focusable="false"
    >
      <path d="M0 34 C42 21 84 31 132 36 C196 43 240 24 299 30 C360 36 410 50 475 35 C538 20 586 26 638 34 C675 40 704 39 720 34 C762 21 804 31 852 36 C916 43 960 24 1019 30 C1080 36 1130 50 1195 35 C1258 20 1306 26 1358 34 C1395 40 1424 39 1440 34 L1440 90 L0 90 Z" />
    </svg>
  </span>
</template>

<style scoped>
.app-blood-fill {
  --cp-blood-fill-color: var(--app-color-primary);
  --cp-blood-fill-back-duration: 3000ms;
  --cp-blood-fill-front-duration: 1800ms;
  --cp-blood-fill-wave-size: var(--app-space-4);
  --cp-blood-fill-back-wave-y: calc(var(--cp-blood-fill-wave-size) * -0.96);
  --cp-blood-fill-front-wave-y: calc(var(--cp-blood-fill-wave-size) * -1.12);

  position: absolute;
  inset: 0;
  pointer-events: none;
  transform: translate3d(0, var(--cp-blood-fill-offset), 0);
  will-change: transform;
}

.app-blood-fill__body,
.app-blood-fill__wave {
  position: absolute;
  pointer-events: none;
}

.app-blood-fill__body {
  inset: 0;
  background: var(--cp-blood-fill-color);
}

.app-blood-fill__wave {
  top: 0;
  left: 0;
  width: 200%;
  height: calc(var(--cp-blood-fill-wave-size) * 1.7);
  color: var(--cp-blood-fill-color);
  will-change: transform;
}

.app-blood-fill__wave path {
  fill: currentColor;
}

.app-blood-fill__wave--back {
  opacity: 0.72;
  animation: app-blood-fill-flow-back var(--cp-blood-fill-back-duration) linear infinite;
  animation-play-state: paused;
}

.app-blood-fill__wave--front {
  animation: app-blood-fill-flow-front var(--cp-blood-fill-front-duration) linear infinite;
  animation-play-state: paused;
}

.app-blood-fill--active {
  .app-blood-fill__wave {
    animation-play-state: running;
  }
}

@keyframes app-blood-fill-flow-front {
  from {
    transform: translate3d(0, var(--cp-blood-fill-front-wave-y), 0);
  }

  to {
    transform: translate3d(-50%, var(--cp-blood-fill-front-wave-y), 0);
  }
}

@keyframes app-blood-fill-flow-back {
  from {
    transform: translate3d(-50%, var(--cp-blood-fill-back-wave-y), 0);
  }

  to {
    transform: translate3d(0, var(--cp-blood-fill-back-wave-y), 0);
  }
}
</style>
