<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import AppBlock from '@/app/shared/components/atoms/block/AppBlock.vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import type { tBaseSizeVariant } from '@/app/styles/contracts/base';

type tAppLineLoaderVariant = 'primary';
type tAppLineLoaderSizeValue = number | string;

interface iAppLineLoaderActions {
  complete?: () => void
}

interface Props {
  progress?: number
  size?: tBaseSizeVariant
  maxWidth?: tAppLineLoaderSizeValue
  width?: tAppLineLoaderSizeValue
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

const hasCompleted = ref(false);

function resolveSizeValue(value: tAppLineLoaderSizeValue) {
  return typeof value === 'number' ? `${value}px` : value;
}

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

const loaderMaxWidth = computed(() => resolveSizeValue(props.maxWidth));
const loaderWidth = computed(() => resolveSizeValue(props.width));
const progressWidth = computed(() => `${normalizedProgress.value}%`);

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
  },
  { immediate: true },
);
</script>

<template>
  <AppFlex
    :class="loaderClass"
    direction="column"
    align="center"
    :width="loaderWidth"
    :max-width="loaderMaxWidth"
  >
    <AppBlock
      class="app-line-loader__track"
      role="progressbar"
      :aria-valuenow="normalizedProgress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <AppBlock class="app-line-loader__progress" />
    </AppBlock>

    <span class="app-line-loader__text">
      {{ text }}
    </span>
  </AppFlex>
</template>

<style scoped>
.app-line-loader__track {
  width: 100%;
  overflow: hidden;
  border-radius: var(--app-radius-full);
  background: var(--app-color-surface-interactive);
}

.app-line-loader__progress {
  height: 100%;
  width: v-bind(progressWidth);
  border-radius: inherit;
  transition: width 180ms ease;
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
  gap: var(--app-space-12);

  .app-line-loader__track {
    height: calc(0.25rem * var(--app-scale));
  }

  .app-line-loader__text {
    font-size: var(--app-font-size-xs);
  }
}

.app-line-loader--size-middle {
  gap: var(--app-space-16);

  .app-line-loader__track {
    height: calc(0.5rem * var(--app-scale));
  }

  .app-line-loader__text {
    font-size: var(--app-font-size-md);
  }
}

.app-line-loader--size-big {
  gap: var(--app-space-20);

  .app-line-loader__track {
    height: calc(0.625rem * var(--app-scale));
  }

  .app-line-loader__text {
    font-size: var(--app-font-size-lg);
  }
}
</style>
