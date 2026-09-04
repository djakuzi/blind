<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  progressRatio?: number
}

const props = withDefaults(defineProps<Props>(), {
  progressRatio: 0,
});

function normalizeProgressRatio(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

const fillStyle = computed(() => {
  const progressRatio = normalizeProgressRatio(props.progressRatio);

  return {
    '--cp-blood-fill-height': `${progressRatio * 100}%`,
  };
});
</script>

<template>
  <span
    class="app-blood-fill"
    :style="fillStyle"
    aria-hidden="true"
  >
    <span class="app-blood-fill__body" />
    <span class="app-blood-fill__wave app-blood-fill__wave--back" />
    <span class="app-blood-fill__wave app-blood-fill__wave--front" />
  </span>
</template>

<style scoped>
.app-blood-fill {
  --cp-blood-fill-color: var(--app-color-primary);
  --cp-blood-fill-wave-size: var(--app-space-4);

  position: absolute;
  inset: auto 0 0;
  height: var(--cp-blood-fill-height);
  pointer-events: none;
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
  left: -50%;
  right: -50%;
  height: calc(var(--cp-blood-fill-wave-size) * 1.7);
  background: var(--cp-blood-fill-color);
  mask-repeat: repeat-x;
  mask-size: 50% 100%;
  -webkit-mask-repeat: repeat-x;
  -webkit-mask-size: 50% 100%;
}

.app-blood-fill__wave--back {
  top: calc(var(--cp-blood-fill-wave-size) * -0.96);
  opacity: 0.72;
  animation: app-blood-fill-flow-back 4200ms linear infinite;
  mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 720 90' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='black' d='M0 39 C47 28 91 42 139 35 C204 24 252 50 319 38 C386 26 433 35 489 43 C553 52 607 26 660 34 C685 38 704 42 720 36 L720 90 L0 90 Z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 720 90' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='black' d='M0 39 C47 28 91 42 139 35 C204 24 252 50 319 38 C386 26 433 35 489 43 C553 52 607 26 660 34 C685 38 704 42 720 36 L720 90 L0 90 Z'/%3E%3C/svg%3E");
}

.app-blood-fill__wave--front {
  top: calc(var(--cp-blood-fill-wave-size) * -1.12);
  animation: app-blood-fill-flow-front 2800ms linear infinite;
  mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 720 90' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='black' d='M0 34 C38 20 86 31 129 36 C190 43 238 23 294 29 C360 36 405 51 470 34 C533 18 584 24 634 33 C674 40 701 36 720 28 L720 90 L0 90 Z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 720 90' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='black' d='M0 34 C38 20 86 31 129 36 C190 43 238 23 294 29 C360 36 405 51 470 34 C533 18 584 24 634 33 C674 40 701 36 720 28 L720 90 L0 90 Z'/%3E%3C/svg%3E");
}

@keyframes app-blood-fill-flow-front {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-25%);
  }
}

@keyframes app-blood-fill-flow-back {
  from {
    transform: translateX(-25%);
  }

  to {
    transform: translateX(0);
  }
}
</style>
