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

  transform-origin: top center;
}

/* Enter */

.app-transition-header-enter-active {
  transition:
    grid-template-rows 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.app-transition-header-enter-active .app-transition-header__content {
  transition:
    opacity 180ms ease 40ms,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1) 40ms;
}

.app-transition-header-enter-from {
  grid-template-rows: 0fr;
}

.app-transition-header-enter-from .app-transition-header__content {
  opacity: 0;
  transform:
    translateY(-0.75rem)
    scale(0.96);
}

.app-transition-header-enter-to {
  grid-template-rows: 1fr;
}

.app-transition-header-enter-to .app-transition-header__content {
  opacity: 1;
  transform:
    translateY(0)
    scale(1);
}

/* Leave */

.app-transition-header-leave-active {
  transition:
    grid-template-rows 180ms cubic-bezier(0.4, 0, 1, 1) 70ms;
}

.app-transition-header-leave-active .app-transition-header__content {
  transition:
    opacity 140ms ease,
    transform 170ms cubic-bezier(0.4, 0, 1, 1);
}

.app-transition-header-leave-from {
  grid-template-rows: 1fr;
}

.app-transition-header-leave-from .app-transition-header__content {
  opacity: 1;
  transform:
    translateY(0)
    scale(1);
}

.app-transition-header-leave-to {
  grid-template-rows: 0fr;
}

.app-transition-header-leave-to .app-transition-header__content {
  opacity: 0;
  transform:
    translateY(-0.75rem)
    scale(0.96);
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