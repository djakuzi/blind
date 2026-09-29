<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import type { PropsAppText } from '@/app/shared/components/atoms/typography/AppText.vue';

export interface PropsAppMarqueeText extends Pick<
  PropsAppText,
  'text' | 'color' | 'fontSize' | 'fontWeight' | 'uppercase'
> {
  speed?: number;
  minDuration?: number;
}

const props = withDefaults(defineProps<PropsAppMarqueeText>(), {
  color: 'text-primary',
  fontSize: 'md',
  fontWeight: 'medium',
  uppercase: false,
  speed: 32,
  minDuration: 4500,
});

const viewportRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const overflowDistance = ref(0);

let resizeObserver: ResizeObserver | null = null;

const isOverflowing = computed(() => overflowDistance.value > 1);

const marqueeDuration = computed(() => {
  const speed = Math.max(1, props.speed);
  const movementRatio = 0.7;
  const movementDuration = (overflowDistance.value / speed / movementRatio) * 1000;

  return `${Math.max(props.minDuration, movementDuration)}ms`;
});

const marqueeStyle = computed(() => ({
  '--cp-marquee-text-distance': `${overflowDistance.value}px`,
  '--cp-marquee-text-duration': marqueeDuration.value,
}));

function updateOverflow() {
  const viewport = viewportRef.value;
  const content = contentRef.value;

  if (!viewport || !content) {
    overflowDistance.value = 0;
    return;
  }

  overflowDistance.value = Math.max(0, content.scrollWidth - viewport.clientWidth);
}

watch(
  () => [props.text, props.fontSize, props.fontWeight, props.uppercase],
  async () => {
    await nextTick();
    updateOverflow();
  },
);

onMounted(async () => {
  await nextTick();
  updateOverflow();

  if (typeof ResizeObserver === 'undefined') {
    return;
  }

  resizeObserver = new ResizeObserver(updateOverflow);

  if (viewportRef.value) {
    resizeObserver.observe(viewportRef.value);
  }

  if (contentRef.value) {
    resizeObserver.observe(contentRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <span
    ref="viewportRef"
    class="app-marquee-text"
    :class="{ 'app-marquee-text--active': isOverflowing }"
    :style="marqueeStyle"
  >
    <span ref="contentRef" class="app-marquee-text__content">
      <AppText
        :text="text"
        tag="span"
        :color="color"
        :font-size="fontSize"
        :font-weight="fontWeight"
        :uppercase="uppercase"
      />
    </span>
  </span>
</template>

<style scoped>
.app-marquee-text {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.app-marquee-text__content {
  display: inline-block;
  min-width: max-content;
  white-space: nowrap;
  transform: translate3d(0, 0, 0);
}

.app-marquee-text--active .app-marquee-text__content {
  animation: app-marquee-text-scroll var(--cp-marquee-text-duration) linear infinite alternate;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .app-marquee-text--active .app-marquee-text__content {
    width: 100%;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    animation: none;
  }
}

@keyframes app-marquee-text-scroll {
  0%,
  15% {
    transform: translate3d(0, 0, 0);
  }

  85%,
  100% {
    transform: translate3d(calc(var(--cp-marquee-text-distance) * -1), 0, 0);
  }
}
</style>
