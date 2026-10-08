<script setup lang="ts">
interface Props {
  show: boolean;
}

defineProps<Props>();
</script>

<template>
  <Transition name="app-transition-header">
    <div v-if="show" class="app-transition-header">
      <div class="app-transition-header__surface" aria-hidden="true" />

      <div class="app-transition-header__content">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.app-transition-header {
  position: relative;
  display: grid;
  grid-template-rows: 1fr;
  flex: 0 0 auto;
  width: calc(100% + var(--cp-layout-padding-horizontal, 0px) * 2);
  margin-top: calc(var(--cp-layout-padding-vertical, 0px) * -1);
  margin-inline: calc(var(--cp-layout-padding-horizontal, 0px) * -1);
}

.app-transition-header__surface {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.app-transition-header__surface::before,
.app-transition-header__surface::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.app-transition-header__surface::before {
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  -webkit-mask-image: linear-gradient(
    180deg,
    #000 0%,
    rgba(0, 0, 0, 0.78) 90%,
    transparent 100%
  );
  mask-image: linear-gradient(
    180deg,
    #000 0%,
    rgba(0, 0, 0, 0.78) 90%,
    transparent 100%
  );
}

.app-transition-header__surface::after {
  background: linear-gradient(
    180deg,
    var(--app-color-surface-glass-top) 10%,
    var(--app-color-surface-glass-bottom) 100%
  );
}

.app-transition-header__content {
  position: relative;
  z-index: 1;
  min-height: 0;
  overflow: hidden;
  transform-origin: top center;
}

/* Enter */

.app-transition-header-enter-active {
  transition: grid-template-rows var(--app-motion-duration-slow) var(--app-motion-ease-enter);
}

.app-transition-header-enter-active .app-transition-header__content {
  transition:
    opacity var(--app-motion-duration-medium) var(--app-motion-ease-default) 40ms,
    transform var(--app-motion-duration-slow) var(--app-motion-ease-enter) 40ms;
}

.app-transition-header-enter-from {
  grid-template-rows: 0fr;
}

.app-transition-header-enter-from .app-transition-header__content {
  opacity: 0;
  transform: translateY(-0.75rem) scale(0.96);
}

.app-transition-header-enter-to {
  grid-template-rows: 1fr;
}

.app-transition-header-enter-to .app-transition-header__content {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Leave */

.app-transition-header-leave-active {
  transition: grid-template-rows var(--app-motion-duration-medium) var(--app-motion-ease-exit) 70ms;
}

.app-transition-header-leave-active .app-transition-header__content {
  transition:
    opacity var(--app-motion-duration-fast) var(--app-motion-ease-default),
    transform 170ms var(--app-motion-ease-exit);
}

.app-transition-header-leave-from {
  grid-template-rows: 1fr;
}

.app-transition-header-leave-from .app-transition-header__content {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.app-transition-header-leave-to {
  grid-template-rows: 0fr;
}

.app-transition-header-leave-to .app-transition-header__content {
  opacity: 0;
  transform: translateY(-0.75rem) scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .app-transition-header-enter-active,
  .app-transition-header-leave-active,
  .app-transition-header-enter-active .app-transition-header__content,
  .app-transition-header-leave-active .app-transition-header__content {
    transition: none;
  }

  .app-transition-header-enter-from,
  .app-transition-header-enter-to,
  .app-transition-header-leave-from,
  .app-transition-header-leave-to {
    grid-template-rows: 1fr;
  }

  .app-transition-header-enter-from .app-transition-header__content,
  .app-transition-header-enter-to .app-transition-header__content,
  .app-transition-header-leave-from .app-transition-header__content,
  .app-transition-header-leave-to .app-transition-header__content {
    opacity: 1;
    transform: none;
  }
}
</style>
