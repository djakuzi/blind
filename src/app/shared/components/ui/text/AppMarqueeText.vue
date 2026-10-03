<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import { useResizeObserver } from '@/app/shared/composables/dom/useResizeObserver';
import type { PropsAppText } from '@/app/shared/components/atoms/typography/AppText.vue';

export interface PropsAppMarqueeText extends Pick<
  PropsAppText,
  'text' | 'color' | 'fontSize' | 'fontWeight' | 'uppercase'
> {
  play?: boolean;
  speed?: number;
  minDuration?: number;
}

const props = withDefaults(defineProps<PropsAppMarqueeText>(), {
  color: 'text-primary',
  fontSize: 'md',
  fontWeight: 'medium',
  uppercase: false,
  play: true,
  speed: 50,
  minDuration: 5000,
});

const viewportRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const cloneRef = ref<HTMLElement | null>(null);

const isOverflowing = ref(false);
const loopDistance = ref(0);

const isMarqueeReady = computed(() => isOverflowing.value && loopDistance.value > 0);
const isMarqueePlaying = computed(() => isMarqueeReady.value && props.play);

const marqueeDuration = computed(() => {
  const speed = Math.max(1, props.speed);
  const duration = (loopDistance.value / speed) * 1000;

  return `${Math.max(props.minDuration, duration)}ms`;
});

const marqueeStyle = computed(() => ({
  '--cp-marquee-text-distance': `${loopDistance.value}px`,
  '--cp-marquee-text-duration': marqueeDuration.value,
}));

async function updateMarquee() {
  const viewport = viewportRef.value;
  const content = contentRef.value;

  if (!viewport || !content) {
    isOverflowing.value = false;
    loopDistance.value = 0;
    return;
  }

  const nextIsOverflowing = content.scrollWidth - viewport.clientWidth > 1;

  isOverflowing.value = nextIsOverflowing;

  if (!nextIsOverflowing) {
    loopDistance.value = 0;
    return;
  }

  await nextTick();

  const clone = cloneRef.value;

  if (!clone) {
    loopDistance.value = 0;
    return;
  }

  loopDistance.value = Math.max(0, clone.offsetLeft - content.offsetLeft);
}

watch(
  () => [props.text, props.fontSize, props.fontWeight, props.uppercase],
  async () => {
    await nextTick();
    updateMarquee();
  },
);

useResizeObserver([viewportRef, contentRef], () => {
  updateMarquee();
});

onMounted(async () => {
  await nextTick();
  updateMarquee();
});
</script>

<template>
  <span
    ref="viewportRef"
    class="app-marquee-text"
    :class="{
      'app-marquee-text--overflowing': isMarqueeReady,
      'app-marquee-text--playing': isMarqueePlaying,
    }"
    :style="marqueeStyle"
  >
    <span class="app-marquee-text__track">
      <span ref="contentRef" class="app-marquee-text__item">
        <AppText
          :text="text"
          tag="span"
          :color="color"
          :font-size="fontSize"
          :font-weight="fontWeight"
          :uppercase="uppercase"
        />
      </span>

      <span
        v-if="isOverflowing"
        ref="cloneRef"
        class="app-marquee-text__item app-marquee-text__item--clone"
        aria-hidden="true"
      >
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
  </span>
</template>

<style scoped>
.app-marquee-text {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.app-marquee-text__track {
  display: inline-flex;
  align-items: center;
  min-width: max-content;
  gap: var(--app-space-8);
  transform: translate3d(0, 0, 0);
}

.app-marquee-text__item {
  display: inline-block;
  flex: 0 0 auto;
  white-space: nowrap;
}

.app-marquee-text--overflowing {
  --cp-marquee-text-edge-fade: var(--app-space-5);

  -webkit-mask-image: linear-gradient(
    to right,
    #000 0,
    #000 calc(100% - var(--cp-marquee-text-edge-fade)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    #000 0,
    #000 calc(100% - var(--cp-marquee-text-edge-fade)),
    transparent 100%
  );
}

.app-marquee-text--playing {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 var(--cp-marquee-text-edge-fade),
    #000 calc(100% - var(--cp-marquee-text-edge-fade)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 var(--cp-marquee-text-edge-fade),
    #000 calc(100% - var(--cp-marquee-text-edge-fade)),
    transparent 100%
  );
}

.app-marquee-text--playing .app-marquee-text__track {
  animation: app-marquee-text-scroll var(--cp-marquee-text-duration) linear infinite;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .app-marquee-text--overflowing {
    -webkit-mask-image: none;
    mask-image: none;
  }

  .app-marquee-text--overflowing .app-marquee-text__track {
    display: block;
    min-width: 0;
    animation: none;
  }

  .app-marquee-text--overflowing .app-marquee-text__item:first-child {
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .app-marquee-text__item--clone {
    display: none;
  }
}

@keyframes app-marquee-text-scroll {
  to {
    transform: translate3d(calc(var(--cp-marquee-text-distance) * -1), 0, 0);
  }
}
</style>
