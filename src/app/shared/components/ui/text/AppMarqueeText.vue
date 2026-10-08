<script setup lang="ts">
import type { PropsTypography } from '@/app/shared/types/props/typography.props';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import { useResizeObserver } from '@/app/shared/composables/dom/useResizeObserver';
import { resolvePaddingValue, type tPaddingValue } from '@/app/shared/styles/contracts/padding.contract';

export interface PropsAppMarqueeText extends PropsTypography {
  text: string;
  play?: boolean;
  speed?: number;
  minDuration?: number;
  paddingX?: tPaddingValue;
  minPaddingX?: tPaddingValue;
}

const props = withDefaults(defineProps<PropsAppMarqueeText>(), {
  color: 'text-primary',
  fontSize: 'md',
  fontWeight: 'medium',
  uppercase: false,
  play: true,
  speed: 50,
  minDuration: 5000,
  paddingX: 0,
  minPaddingX: 0,
});

const viewportRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);
const cloneRef = ref<HTMLElement | null>(null);
const paddingMeasureRef = ref<HTMLElement | null>(null);

const isOverflowing = ref(false);
const loopDistance = ref(0);
const effectivePaddingX = ref<string>();

const isMarqueeReady = computed(() => isOverflowing.value && loopDistance.value > 0);
const isMarqueePlaying = computed(() => isMarqueeReady.value && props.play);
const contentPaddingX = computed(() => resolvePaddingValue(props.paddingX));
const minContentPaddingX = computed(() => resolvePaddingValue(props.minPaddingX));
const itemPaddingX = computed(() => effectivePaddingX.value ?? contentPaddingX.value);

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
  const text = textRef.value;
  const paddingMeasure = paddingMeasureRef.value;

  if (!viewport || !content || !text || !paddingMeasure) {
    isOverflowing.value = false;
    loopDistance.value = 0;
    effectivePaddingX.value = undefined;
    return;
  }

  const textWidth = text.offsetWidth;
  const viewportWidth = viewport.clientWidth;
  const paddingStyle = getComputedStyle(paddingMeasure);

  const desiredPadding = Number.parseFloat(paddingStyle.paddingLeft) || 0;
  const minPadding = Math.min(desiredPadding, Number.parseFloat(paddingStyle.paddingRight) || 0);
  const availablePadding = Math.max(0, (viewportWidth - textWidth) / 2);

  const nextIsOverflowing = textWidth + minPadding * 2 - viewportWidth > 1;
  const nextPadding = nextIsOverflowing ? minPadding : Math.min(desiredPadding, availablePadding);

  effectivePaddingX.value = `${nextPadding}px`;
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
  () => [props.text, props.fontSize, props.fontWeight, props.uppercase, props.paddingX, props.minPaddingX],
  async () => {
    await nextTick();
    updateMarquee();
  },
);

useResizeObserver([viewportRef, textRef], () => {
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
    <span
      ref="paddingMeasureRef"
      class="app-marquee-text__padding-measure"
      aria-hidden="true"
    />

    <span class="app-marquee-text__track">
      <span ref="contentRef" class="app-marquee-text__item">
        <span ref="textRef" class="app-marquee-text__content">
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
  position: relative;
  max-width: 100%;
  overflow: hidden;
}

.app-marquee-text__padding-measure {
  position: absolute;
  width: 0;
  height: 0;
  padding-left: v-bind(contentPaddingX);
  padding-right: v-bind(minContentPaddingX);
  visibility: hidden;
  pointer-events: none;
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
  padding-inline: v-bind(itemPaddingX);
  white-space: nowrap;
}

.app-marquee-text__content {
  display: inline-block;
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
