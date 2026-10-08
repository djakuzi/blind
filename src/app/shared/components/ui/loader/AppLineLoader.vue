<script setup lang="ts">
import type { PropsWidth, PropsSizeVariant } from '@/app/shared/types/props';
import { computed, nextTick, ref, watch } from 'vue';
import AppBlock from '@/app/shared/components/atoms/block/AppBlock.vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';

import { LibNumber } from '@/core/lib/number';

export type tAppLineLoaderMode = 'determinate' | 'indeterminate';
type tAppLineLoaderVariant = 'primary';

interface iAppLineLoaderActions {
  complete?: () => void;
}

interface Props extends PropsWidth, PropsSizeVariant {
  mode?: tAppLineLoaderMode;
  progress?: number;
  variant?: tAppLineLoaderVariant;
  actions?: iAppLineLoaderActions;
  text: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'determinate',
  progress: 0,
  size: 'middle',
  maxWidth: '100%',
  width: '100%',
  variant: 'primary',
  actions: undefined,
});

const emit = defineEmits<{
  complete: [];
}>();

const hasCompleted = ref(false);
const progressElement = ref<HTMLElement | null>(null);

const normalizedProgress = computed(() => LibNumber.clampFinite(props.progress, 0, 100, 0));

const loaderClass = computed(() => [
  'app-line-loader',
  `app-line-loader--${props.variant}`,
  `app-line-loader--size-${props.size}`,
  `app-line-loader--${props.mode}`,
  {
    'app-line-loader--has-text': Boolean(props.text),
  },
]);

const progressScale = computed(() => normalizedProgress.value / 100);

const progressAria = computed(() => {
  if (props.mode === 'indeterminate') {
    return {};
  }

  return {
    'aria-valuenow': normalizedProgress.value,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
  };
});

function handleProgressTransitionEnd(event: TransitionEvent) {
  if (props.mode !== 'determinate' || event.propertyName !== 'transform' || normalizedProgress.value < 100) {
    return;
  }

  emitComplete();
}

function emitComplete() {
  if (hasCompleted.value) {
    return;
  }

  hasCompleted.value = true;
  props.actions?.complete?.();
  emit('complete');
}

async function waitProgressAnimationComplete() {
  if (props.mode !== 'determinate') {
    return;
  }

  await nextTick();

  const animations = progressElement.value?.getAnimations() ?? [];

  if (animations.length === 0) {
    emitComplete();

    return;
  }

  await Promise.allSettled(animations.map((animation) => animation.finished));
  emitComplete();
}

watch(
  [normalizedProgress, () => props.mode],
  ([progress, mode]) => {
    if (mode !== 'determinate' || progress < 100) {
      hasCompleted.value = false;

      return;
    }

    waitProgressAnimationComplete();
  },
  { immediate: true },
);
</script>

<template>
  <AppFlex :class="loaderClass" direction="column" align="center" :width="width" :max-width="maxWidth">
    <AppBlock class="app-line-loader__track" overflow="hidden" role="progressbar" v-bind="progressAria">
      <div
        ref="progressElement"
        class="app-line-loader__progress"
        :style="{ '--cp-line-loader-progress': progressScale }"
        @transitionend="handleProgressTransitionEnd"
      />
    </AppBlock>

    <span v-if="text" class="app-line-loader__text">
      {{ text }}
    </span>
  </AppFlex>
</template>

<style scoped>
.app-line-loader__track {
  width: 100%;
  border-radius: var(--app-radius-full);
  background: var(--app-color-surface-interactive);
}

.app-line-loader__progress {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: var(--app-color-primary);
}

.app-line-loader--determinate .app-line-loader__progress {
  transform: scaleX(var(--cp-line-loader-progress));
  transform-origin: left center;
  transition: transform var(--app-motion-duration-medium) var(--app-motion-ease-default);
}

.app-line-loader--indeterminate .app-line-loader__progress {
  width: 34%;
  transform: translate3d(-120%, 0, 0);
  animation: app-line-loader-indeterminate 1.15s var(--app-motion-ease-in-out) infinite;
  will-change: transform;
}

.app-line-loader__text {
  color: var(--app-color-text-primary);
  font-weight: var(--app-font-weight-medium);
  line-height: var(--app-line-height-control);
  letter-spacing: var(--app-letter-spacing-wider);
  text-transform: uppercase;
}

.app-line-loader--size-small {
  .app-line-loader__track {
    height: 0.5rem;
  }

  .app-line-loader__text {
    font-size: var(--app-font-size-xs);
  }
}

.app-line-loader--size-middle {
  .app-line-loader__track {
    height: 0.75rem;
  }

  .app-line-loader__text {
    font-size: var(--app-font-size-sm);
  }
}

.app-line-loader--size-big {
  .app-line-loader__track {
    height: 1rem;
  }

  .app-line-loader__text {
    font-size: var(--app-font-size-md);
  }
}

.app-line-loader--has-text {
  &.app-line-loader--size-small {
    gap: var(--app-space-3);
  }

  &.app-line-loader--size-middle {
    gap: var(--app-space-5);
  }

  &.app-line-loader--size-big {
    gap: var(--app-space-7);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-line-loader--indeterminate .app-line-loader__progress {
    width: 34%;
    transform: translate3d(0, 0, 0);
    animation: none;
  }
}

@keyframes app-line-loader-indeterminate {
  from {
    transform: translate3d(-120%, 0, 0);
  }

  to {
    transform: translate3d(395%, 0, 0);
  }
}
</style>
