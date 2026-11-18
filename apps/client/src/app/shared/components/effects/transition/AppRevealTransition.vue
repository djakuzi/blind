<script setup lang="ts">
import type { PropsTransitionTiming } from '@/app/shared/types/props/animation.props';
import { cloneVNode, computed, useSlots } from 'vue';

const props = withDefaults(defineProps<PropsTransitionTiming>(), {
  active: false,
  duration: 320,
  delay: 0,
});
const slots = useSlots();
const animatedNode = computed(() => {
  const node = slots.default?.().find((vnode) => typeof vnode.type !== 'symbol');
  if (!node) return null;
  return cloneVNode(node, {
    class: props.active ? 'app-reveal-transition--active' : undefined,
    style: motionStyle.value,
  });
});
const motionStyle = computed(() => ({
  '--effect-duration': `${props.duration}ms`,
  '--effect-delay': `${props.delay}ms`,
}));
const RenderNode = () => animatedNode.value;
</script>

<template>
  <RenderNode />
</template>

<style>
.app-reveal-transition--active {
  will-change: transform, opacity;
  animation: app-effect-reveal var(--effect-duration) var(--effect-delay) forwards;
}
@keyframes app-effect-reveal {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.82);
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  24% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.06);
  }
  36% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  72% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    animation-timing-function: cubic-bezier(0.4, 0, 0.8, 0.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.94);
  }
}
@media (prefers-reduced-motion: reduce) {
  .app-reveal-transition--active {
    animation: none;
  }
}
</style>
