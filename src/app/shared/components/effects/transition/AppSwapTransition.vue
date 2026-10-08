<script setup lang="ts">
interface PropsAppSwapTransition {
  transitionKey: string | number;
}

defineProps<PropsAppSwapTransition>();
</script>

<template>
  <div class="app-swap-transition">
    <Transition
      name="app-swap-transition-content"
      mode="out-in"
    >
      <div
        :key="transitionKey"
        class="app-swap-transition__content"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-swap-transition,
.app-swap-transition__content {
  width: 100%;
  min-width: 0;
}

.app-swap-transition__content {
  display: flex;
  min-height: inherit;
}

.app-swap-transition__content > * {
  flex: 1 1 auto;
}

.app-swap-transition-content-enter-active {
  transition:
    opacity var(--app-motion-duration-medium) var(--app-motion-ease-default),
    transform var(--app-motion-duration-medium) var(--app-motion-ease-enter);
}

.app-swap-transition-content-leave-active {
  transition:
    opacity var(--app-motion-duration-fast) var(--app-motion-ease-default),
    transform var(--app-motion-duration-fast) var(--app-motion-ease-exit);
}

.app-swap-transition-content-enter-from {
  opacity: 0;
  transform: translateY(0.5rem);
}

.app-swap-transition-content-enter-to,
.app-swap-transition-content-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.app-swap-transition-content-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .app-swap-transition-content-enter-active,
  .app-swap-transition-content-leave-active {
    transition: none;
  }

  .app-swap-transition-content-enter-from,
  .app-swap-transition-content-enter-to,
  .app-swap-transition-content-leave-from,
  .app-swap-transition-content-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
