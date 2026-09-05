<script setup lang="ts">
interface Props {
  disabled?: boolean
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

  transform: scale(1);
  transform-origin: center;

  transition:
    transform 140ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .app-interaction-scale:not(.app-interaction-scale--disabled):hover {
    transform: scale(1.03);
  }
}

.app-interaction-scale:not(.app-interaction-scale--disabled):active {
  transform: scale(0.92);
  transition-duration: 70ms;
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