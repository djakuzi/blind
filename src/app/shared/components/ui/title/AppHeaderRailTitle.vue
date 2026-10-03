<script setup lang="ts">
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import type { PropsAppTitle } from '@/app/shared/components/atoms/typography/AppTitle.vue';

export interface PropsAppHeaderRailTitle extends PropsAppTitle {}

const props = defineProps<PropsAppHeaderRailTitle>();
</script>

<template>
  <div class="app-header-rail-title">
    <span class="app-header-rail-title__line" aria-hidden="true" />

    <div class="app-header-rail-title__center">
      <span class="app-header-rail-title__dot app-header-rail-title__dot--left" aria-hidden="true" />
      <span class="app-header-rail-title__diag app-header-rail-title__diag--left" aria-hidden="true" />

      <AppTitle
        class="app-header-rail-title__title"
        v-bind="props"
      />

      <span class="app-header-rail-title__diag app-header-rail-title__diag--right" aria-hidden="true" />
      <span class="app-header-rail-title__dot app-header-rail-title__dot--right" aria-hidden="true" />
      <span class="app-header-rail-title__underline" aria-hidden="true" />
    </div>

    <span class="app-header-rail-title__line" aria-hidden="true" />
  </div>
</template>

<style scoped>
.app-header-rail-title {
  --cp-header-rail-title-line-opacity: 0.55;
  --cp-header-rail-title-top-offset: 1rem;
  --cp-header-rail-title-diagonal-width: 2.4rem;
  --cp-header-rail-title-diagonal-angle: 28deg;
  --cp-header-rail-title-underline-offset: 1.2rem;
  --cp-header-rail-title-side-padding: var(--app-space-4);
  --cp-header-rail-title-dot-size: 0.5rem;

  display: flex;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
}

.app-header-rail-title__line {
  flex: 1 1 0;
  min-width: 0;
  height: var(--app-border-width-thin);
  margin-top: var(--cp-header-rail-title-top-offset);
  background: var(--app-color-border-contrast);
  opacity: var(--cp-header-rail-title-line-opacity);
}

.app-header-rail-title__center {
  position: relative;
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  padding:
    0
    calc(var(--cp-header-rail-title-diagonal-width) + var(--cp-header-rail-title-side-padding))
    calc(var(--cp-header-rail-title-underline-offset) + var(--app-space-2));
}

.app-header-rail-title__title {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-header-rail-title__underline {
  position: absolute;
  right: calc(var(--cp-header-rail-title-diagonal-width) + var(--cp-header-rail-title-side-padding));
  bottom: 0;
  left: calc(var(--cp-header-rail-title-diagonal-width) + var(--cp-header-rail-title-side-padding));
  height: var(--app-border-width-thin);
  background: var(--app-color-border-contrast);
  opacity: var(--cp-header-rail-title-line-opacity);
}

.app-header-rail-title__diag {
  position: absolute;
  top: var(--cp-header-rail-title-top-offset);
  width: calc(var(--cp-header-rail-title-diagonal-width) * 1.14);
  height: var(--app-border-width-thin);
  background: var(--app-color-border-contrast);
  opacity: var(--cp-header-rail-title-line-opacity);
}

.app-header-rail-title__diag--left {
  left: 0;
  transform: rotate(var(--cp-header-rail-title-diagonal-angle));
  transform-origin: left center;
}

.app-header-rail-title__diag--right {
  right: 0;
  transform: rotate(calc(var(--cp-header-rail-title-diagonal-angle) * -1));
  transform-origin: right center;
}

.app-header-rail-title__dot {
  position: absolute;
  top: calc(var(--cp-header-rail-title-top-offset) - var(--cp-header-rail-title-dot-size) / 2);
  z-index: 1;
  width: var(--cp-header-rail-title-dot-size);
  height: var(--cp-header-rail-title-dot-size);
  border-radius: 50%;
  background: var(--app-color-primary);
}

.app-header-rail-title__dot--left {
  left: 0;
  transform: translateX(-50%);
}

.app-header-rail-title__dot--right {
  right: 0;
  transform: translateX(50%);
}
</style>
