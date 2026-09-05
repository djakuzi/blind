<script setup lang="ts">
interface Props {
  show: boolean
}

defineProps<Props>();
</script>

<template>
  <Transition name="app-transition-header">
    <div
      v-if="show"
      class="app-transition-header"
    >
      <div class="app-transition-header__content">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.app-transition-header {
  display: grid;
  grid-template-rows: 1fr;

  flex: 0 0 auto;

  width: 100%;
}

.app-transition-header__content {
  min-height: 0;
  overflow: hidden;
}

.app-transition-header-enter-active,
.app-transition-header-leave-active {
  transition:
    grid-template-rows 180ms ease,
    opacity 160ms ease,
    transform 180ms ease;
}

.app-transition-header-enter-from,
.app-transition-header-leave-to {
  grid-template-rows: 0fr;

  opacity: 0;
  transform: translateY(-0.5rem);
}

.app-transition-header-enter-to,
.app-transition-header-leave-from {
  grid-template-rows: 1fr;

  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .app-transition-header-enter-active,
  .app-transition-header-leave-active {
    transition: none;
  }

  .app-transition-header-enter-from,
  .app-transition-header-enter-to,
  .app-transition-header-leave-from,
  .app-transition-header-leave-to {
    transform: none;
  }
}
</style>