<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import AppBlock from '@/app/shared/components/atoms/block/AppBlock.vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import type { PropsAppBlock } from '@/app/shared/components/atoms/block/AppBlock.vue';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';

type tAppLineLoaderVariant = 'primary';

interface iAppLineLoaderActions {
  complete?: () => void
}

interface Props {
  progress?: number
  size?: tBaseSizeVariant
  maxWidth?: PropsAppBlock['maxWidth']
  width?: PropsAppBlock['width']
  variant?: tAppLineLoaderVariant
  actions?: iAppLineLoaderActions
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  size: 'middle',
  maxWidth: '100%',
  width: '100%',
  variant: 'primary',
  actions: undefined,
  text: 'Загрузка',
});

const emit = defineEmits<{
  complete: []
}>();

const hasCompleted = ref(false);

const normalizedProgress = computed(() => {
  if (!Number.isFinite(props.progress)) {
    return 0;
  }

  return Math.min(100, Math.max(0, props.progress));
});

const loaderClass = computed(() => [
  'app-line-loader',
  `app-line-loader--${props.variant}`,
  `app-line-loader--size-${props.size}`,
]);

const progressScale = computed(() => normalizedProgress.value / 100);

function handleProgressTransitionEnd(event: TransitionEvent) {
  if (event.propertyName !== 'transform' || normalizedProgress.value < 100) {
    return;
  }

  emit('complete');
}

watch(
  normalizedProgress,
  (progress) => {
    if (progress < 100) {
      hasCompleted.value = false;

      return;
    }

    if (hasCompleted.value) {
      return;
    }

    hasCompleted.value = true;
    props.actions?.complete?.();

    if (progressScale.value === 1) {
      return;
    }
  },
  { immediate: true },
);
</script>

<template>
  <AppFlex
    :class="loaderClass"
    direction="column"
    align="center"
    :width="width"
    :max-width="maxWidth"
  >
    <AppBlock
      class="app-line-loader__track"
      overflow="hidden"
      role="progressbar"
      :aria-valuenow="normalizedProgress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <AppBlock
        class="app-line-loader__progress"
        :style="{ '--cp-line-loader-progress': progressScale }"
        @transitionend="handleProgressTransitionEnd"
      />
    </AppBlock>

    <span class="app-line-loader__text">
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
  transform: scaleX(var(--cp-line-loader-progress));
  transform-origin: left center;
  transition: transform 180ms ease;
}

.app-line-loader__text {
  color: var(--app-color-text-primary);
  font-family: var(--app-font-family-base);
  font-weight: var(--app-font-weight-medium);
  line-height: var(--app-line-height-control);
  letter-spacing: var(--app-letter-spacing-wider);
  text-transform: uppercase;
}

.app-line-loader--primary {
  .app-line-loader__progress {
    background: var(--app-color-primary);
  }
}

.app-line-loader--size-small {
  gap: var(--app-space-3);

  .app-line-loader__track {
    height: 0.25rem;
  }

  .app-line-loader__text {
    font-size: var(--app-font-size-sm);
  }
}

.app-line-loader--size-middle {
  gap: var(--app-space-5);

  .app-line-loader__track {
    height: 0.5rem;
  }

  .app-line-loader__text {
    font-size: var(--app-font-size-md);
  }
}

.app-line-loader--size-big {
  gap: var(--app-space-7);

  .app-line-loader__track {
    height: 0.625rem;
  }

  .app-line-loader__text {
    font-size: var(--app-font-size-lg);
  }
}
</style>
