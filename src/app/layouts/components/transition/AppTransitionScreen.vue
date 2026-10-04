<template>
  <div class="app-transition-screen">
    <Transition name="app-transition-screen-view">
      <slot />
    </Transition>
  </div>
</template>

<style>
.app-transition-screen {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
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
  position: absolute;
  inset: 0;
  transform-origin: center;
  backface-visibility: hidden;
  will-change: opacity, transform;
  transition:
    opacity var(--app-motion-duration-slow) var(--app-motion-ease-default),
    transform var(--app-motion-duration-slow) var(--app-motion-ease-enter);
}

.app-transition-screen-view-enter-from {
  opacity: 0;
  transform: translateZ(70px) scale(1.05);
}

.app-transition-screen-view-enter-to {
  opacity: 1;
  transform: translateZ(0) scale(1);
}

.app-transition-screen-view-leave-from {
  opacity: 1;
  transform: translateZ(0) scale(1);
}

.app-transition-screen-view-leave-to {
  opacity: 0;
  transform: translateZ(-90px) scale(0.94);
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
