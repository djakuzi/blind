<script setup lang="ts">
import type { PropsTransitionTiming } from '@/app/shared/types/props/animation.props';
import { cloneVNode, computed, useSlots } from 'vue';

interface Props extends PropsTransitionTiming {
  holdUntilEnd?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  duration: 320,
  delay: 0,
  holdUntilEnd: false,
});
const slots = useSlots();
const animatedNode = computed(() => {
  const node = slots.default?.().find((vnode) => typeof vnode.type !== 'symbol');
  if (!node) return null;
  return cloneVNode(node, {
    class: props.active ? (props.holdUntilEnd ? 'app-fade-transition--held' : 'app-fade-transition--active') : undefined,
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
.app-fade-transition--active {
  animation: app-effect-fade-out var(--effect-duration) ease-out var(--effect-delay) forwards;
}
.app-fade-transition--held {
  animation: app-effect-fade-held var(--effect-duration) ease-out var(--effect-delay) forwards;
}
@keyframes app-effect-fade-out {
  to {
    opacity: 0;
  }
}
@keyframes app-effect-fade-held {
  0%,
  68% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .app-fade-transition--active {
    animation: none;
  }
  .app-fade-transition--held {
    animation: app-effect-fade-out 200ms ease-out forwards;
  }
}
</style>
