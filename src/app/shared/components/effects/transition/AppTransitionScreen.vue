<template>
  <Transition
    name="app-transition-screen"
    mode="out-in"
  >
    <slot />
  </Transition>
</template>

<style>
.app-transition-screen-enter-active,
.app-transition-screen-leave-active {
  transform-origin: center;

  transition:
    opacity 180ms ease,
    transform 180ms ease;

  will-change:
    opacity,
    transform;
}

.app-transition-screen-enter-from {
  opacity: 0;
  transform: scale(1.015);
}

.app-transition-screen-enter-to {
  opacity: 1;
  transform: scale(1);
}

.app-transition-screen-leave-from {
  opacity: 1;
  transform: scale(1);
}

.app-transition-screen-leave-to {
  opacity: 0;
  transform: scale(0.985);
}

@media (prefers-reduced-motion: reduce) {
  .app-transition-screen-enter-active,
  .app-transition-screen-leave-active {
    transition: none;
  }

  .app-transition-screen-enter-from,
  .app-transition-screen-enter-to,
  .app-transition-screen-leave-from,
  .app-transition-screen-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>