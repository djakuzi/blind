<script setup lang="ts">
interface Props {
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});
</script>

<template>
  <span
    class="app-interaction-scale"
    :class="{
      'app-interaction-scale--disabled': disabled,
    }"
  >
    <slot />
  </span>
</template>

<style scoped>
.app-interaction-scale {
  display: inline-flex;
  transform: translate3d(0, 0, 0) scale(1);
  transform-origin: center;
  backface-visibility: hidden;
  will-change: transform;
  transition: transform var(--app-motion-duration-fast) var(--app-motion-ease-enter);
}

@media (hover: hover) and (pointer: fine) {
  .app-interaction-scale:not(.app-interaction-scale--disabled):hover {
    transform: translate3d(0, 0, 0) scale(1.015);
  }
}

.app-interaction-scale:not(.app-interaction-scale--disabled):active {
  transform: translate3d(0, 0, 0) scale(0.97);
  transition-duration: 90ms;
}

@media (prefers-reduced-motion: reduce) {
  .app-interaction-scale {
    transition: none;
  }

  .app-interaction-scale:hover,
  .app-interaction-scale:active {
    transform: none;
  }
}
</style>
