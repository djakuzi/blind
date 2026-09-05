<template>
  <div class="app-transition-screen">
    <Transition
      name="app-transition-screen-view"
      mode="out-in"
    >
      <slot />
    </Transition>
  </div>
</template>

<style>
.app-transition-screen {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;

  width: 100%;
  min-width: 0;
  min-height: 0;

  perspective: 1000px;
  perspective-origin: center;
}

.app-transition-screen > * {
  flex: 1 1 auto;

  width: 100%;
  min-width: 0;
  min-height: 0;
}

.app-transition-screen-view-enter-active,
.app-transition-screen-view-leave-active {
  transform-origin: center;
  backface-visibility: hidden;

  transition:
    opacity 230ms ease,
    transform 230ms cubic-bezier(0.22, 1, 0.36, 1);

  will-change:
    opacity,
    transform;
}

.app-transition-screen-view-enter-from {
  opacity: 0;

  transform:
    translateZ(70px)
    scale(1.05);
}

.app-transition-screen-view-enter-to {
  opacity: 1;

  transform:
    translateZ(0)
    scale(1);
}

.app-transition-screen-view-leave-from {
  opacity: 1;

  transform:
    translateZ(0)
    scale(1);
}

.app-transition-screen-view-leave-to {
  opacity: 0;

  transform:
    translateZ(-90px)
    scale(0.94);
}

@media (prefers-reduced-motion: reduce) {
  .app-transition-screen-view-enter-active,
  .app-transition-screen-view-leave-active {
    transition: none;
  }

  .app-transition-screen-view-enter-from,
  .app-transition-screen-view-enter-to,
  .app-transition-screen-view-leave-from,
  .app-transition-screen-view-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>