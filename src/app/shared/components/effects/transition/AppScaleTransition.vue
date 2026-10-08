<script setup lang="ts">
import type { PropsTransitionTiming } from '@/app/shared/types/props/animation.props';
import { cloneVNode, computed, useSlots } from 'vue';

interface Props extends PropsTransitionTiming {
  fromScale?: number;
  toScale?: number;
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  duration: 320,
  delay: 0,
  fromScale: 0.82,
  toScale: 1,
});
const slots = useSlots();
const animatedNode = computed(() => {
  const node = slots.default?.().find((vnode) => typeof vnode.type !== 'symbol');
  if (!node) return null;
  return cloneVNode(node, {
    class: props.active ? 'app-scale-transition--active' : undefined,
    style: { ...motionStyle.value, '--effect-scale-from': String(props.fromScale), '--effect-scale-to': String(props.toScale) },
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
.app-scale-transition--active {
  animation: app-effect-scale var(--effect-duration) ease-out var(--effect-delay) forwards;
}
@keyframes app-effect-scale {
  from {
    opacity: 0;
    scale: var(--effect-scale-from);
  }
  to {
    opacity: 1;
    scale: var(--effect-scale-to);
  }
}
@media (prefers-reduced-motion: reduce) {
  .app-scale-transition--active {
    animation: none;
  }
}
</style>
