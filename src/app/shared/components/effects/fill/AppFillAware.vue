<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { FILL_CONTEXT } from '@/app/shared/context/fill/fill.context';
import { resolveColorValue, type tColorValue } from '@/app/styles/contracts/color.contract';

type tAppFillAwareTag = 'span' | 'div';

export interface PropsAppFillAware {
  tag?: tAppFillAwareTag
  threshold?: number
  color?: tColorValue
  filledColor?: tColorValue
  transitionDuration?: number
}

const props = withDefaults(defineProps<PropsAppFillAware>(), {
  tag: 'span',
  threshold: 0.5,
  color: 'inherit',
  filledColor: 'on-primary',
  transitionDuration: 400,
});

defineSlots<{
  default(props: {
    filled: boolean
    coverageRatio: number
  }): unknown
}>();

const context = inject(FILL_CONTEXT, null);

const element = ref<HTMLElement | null>(null);
const topRatio = ref(0);
const bottomRatio = ref(1);

let resizeObserver: ResizeObserver | null = null;

const normalizedThreshold = computed(() => Math.min(1, Math.max(0, props.threshold)));

const coverageRatio = computed(() => {
  const progress = context?.progressRatio.value ?? 0;
  const fillTop = 1 - progress;
  const height = bottomRatio.value - topRatio.value;

  if (height <= 0) {
    return 0;
  }

  const filledHeight = bottomRatio.value - Math.max(topRatio.value, fillTop);

  return Math.min(1, Math.max(0, filledHeight / height));
});

const filled = computed(() => coverageRatio.value >= normalizedThreshold.value);

const currentColor = computed(() => resolveColorValue(
  filled.value ? props.filledColor : props.color,
));

const elementStyle = computed(() => ({
  color: currentColor.value,
  '--cp-fill-aware-transition-duration': `${Math.max(0, props.transitionDuration)}ms`,
}));

function updatePosition() {
  const root = context?.rootElement.value;
  const target = element.value;

  if (!root || !target) {
    return;
  }

  const rootRect = root.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  if (rootRect.height <= 0 || targetRect.height <= 0) {
    return;
  }

  topRatio.value = Math.min(
    1,
    Math.max(0, (targetRect.top - rootRect.top) / rootRect.height),
  );

  bottomRatio.value = Math.min(
    1,
    Math.max(0, (targetRect.bottom - rootRect.top) / rootRect.height),
  );
}

function observeElements() {
  resizeObserver?.disconnect();

  const root = context?.rootElement.value;
  const target = element.value;

  if (root) {
    resizeObserver?.observe(root);
  }

  if (target) {
    resizeObserver?.observe(target);
  }
}

watch(() => context?.rootElement.value, async () => {
  await nextTick();
  observeElements();
  updatePosition();
});

watch(() => context?.isActive.value, async (isActive) => {
  if (!isActive) {
    return;
  }

  await nextTick();
  updatePosition();
});

onMounted(async () => {
  resizeObserver = new ResizeObserver(updatePosition);

  await nextTick();
  observeElements();
  updatePosition();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <component
    :is="tag"
    ref="element"
    class="app-fill-aware"
    :class="{ 'app-fill-aware--filled': filled }"
    :style="elementStyle"
  >
    <slot
      :filled="filled"
      :coverage-ratio="coverageRatio"
    />
  </component>
</template>

<style scoped>
.app-fill-aware {
  transition: color var(--cp-fill-aware-transition-duration) ease;
}
</style>