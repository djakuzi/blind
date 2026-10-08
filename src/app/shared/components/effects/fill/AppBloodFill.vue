<script setup lang="ts">
import { computed } from 'vue';
import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import { resolveColorValue, type tColorValue } from '@/app/styles/contracts/color.contract';
import { LibNumber } from '@/core/lib/number';

export interface PropsAppBloodFill {
  color?: tColorValue;
  flowFrontDuration?: number;
  isActive?: boolean;
  progressRatio?: number;
  waveHeight?: tStyleSizeValue;
  waveLengthScale?: number;
}

const props = withDefaults(defineProps<PropsAppBloodFill>(), {
  color: 'primary',
  flowFrontDuration: 1200,
  isActive: false,
  progressRatio: undefined,
  waveHeight: 'var(--app-space-8)',
  waveLengthScale: 1,
});

function normalizeDuration(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, value);
}

function normalizeWaveLengthScale(value: number) {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(0.5, value);
}

const fillStyle = computed(() => {
  const progressOffset =
    props.progressRatio === undefined
      ? 'var(--cp-hold-progress-offset, 100%)'
      : `${(1 - LibNumber.clampFinite(props.progressRatio, 0, 1, 0)) * 100}%`;

  return {
    '--cp-blood-fill-color': resolveColorValue(props.color) ?? 'var(--app-color-primary)',
    '--cp-blood-fill-offset': progressOffset,
    '--cp-blood-fill-front-duration': `${normalizeDuration(props.flowFrontDuration)}ms`,
    '--cp-blood-fill-wave-height': LibStyle.toSizeValue(props.waveHeight) ?? 'var(--app-space-8)',
    '--cp-blood-fill-wave-width': `${normalizeWaveLengthScale(props.waveLengthScale) * 200}%`,
  };
});

const fillClass = computed(() => ['app-blood-fill', { 'app-blood-fill--active': props.isActive }]);
</script>

<template>
  <span :class="fillClass" :style="fillStyle" aria-hidden="true">
    <span class="app-blood-fill__body" />
    <span class="app-blood-fill__wave app-blood-fill__wave--front" />
  </span>
</template>

<style scoped>
.app-blood-fill {
  --cp-blood-fill-color: var(--app-color-primary);
  --cp-blood-fill-front-duration: 1200ms;
  --cp-blood-fill-wave-height: var(--app-space-8);
  --cp-blood-fill-wave-width: 200%;
  --cp-blood-fill-front-wave-y: calc(var(--cp-blood-fill-wave-height) * -0.62);

  position: absolute;
  inset: 0;
  pointer-events: none;
  transform: translate3d(0, var(--cp-blood-fill-offset), 0);
}

.app-blood-fill__body,
.app-blood-fill__wave {
  position: absolute;
  pointer-events: none;
}

.app-blood-fill__body {
  width: 110%;
  inset: 0;
  z-index: 0;
  background: var(--cp-blood-fill-color);
}

.app-blood-fill__wave {
  top: 0;
  left: 0;
  width: var(--cp-blood-fill-wave-width);
  height: var(--cp-blood-fill-wave-height);
  z-index: 1;
}

.app-blood-fill__wave--front {
  animation: app-blood-fill-flow-front var(--cp-blood-fill-front-duration) linear infinite;
  animation-play-state: paused;
  background: var(--cp-blood-fill-color);
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 720 90' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23000' d='M0 34 C39 20 86 31 132 36 C196 43 240 24 299 30 C360 36 410 50 475 35 C538 20 586 26 638 34 C672 40 697 39 720 34 C732 34 732 34 720 34 L720 90 L0 90 C-12 90 -12 90 0 90 Z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 720 90' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23000' d='M0 34 C39 20 86 31 132 36 C196 43 240 24 299 30 C360 36 410 50 475 35 C538 20 586 26 638 34 C672 40 697 39 720 34 C732 34 732 34 720 34 L720 90 L0 90 C-12 90 -12 90 0 90 Z'/%3E%3C/svg%3E");
  -webkit-mask-repeat: repeat-x;
  mask-repeat: repeat-x;
  -webkit-mask-size: 50% 100%;
  mask-size: 50% 100%;
}

.app-blood-fill--active {
  will-change: transform;

  .app-blood-fill__wave {
    animation-play-state: running;
    will-change: transform;
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
</style>
