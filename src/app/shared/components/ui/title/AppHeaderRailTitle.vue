<script setup lang="ts">
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import type { PropsAppTitle } from '@/app/shared/components/atoms/typography/AppTitle.vue';

export interface PropsAppHeaderRailTitle extends PropsAppTitle {}

const props = defineProps<PropsAppHeaderRailTitle>();
</script>

<template>
  <div class="app-header-rail-title">
    <span class="app-header-rail-title__line" aria-hidden="true" />
    <span class="app-header-rail-title__accent" aria-hidden="true" />

    <span class="app-header-rail-title__shoulder app-header-rail-title__shoulder--left" aria-hidden="true" />

    <div class="app-header-rail-title__frame">
      <AppTitle
        class="app-header-rail-title__title"
        v-bind="props"
      />
    </div>

    <span class="app-header-rail-title__shoulder app-header-rail-title__shoulder--right" aria-hidden="true" />

    <span class="app-header-rail-title__accent" aria-hidden="true" />
    <span class="app-header-rail-title__line" aria-hidden="true" />
  </div>
</template>

<style scoped>
.app-header-rail-title {
  --cp-header-rail-title-line-opacity: 0.55;
  --cp-header-rail-title-shoulder-width: 2.5rem;
  --cp-header-rail-title-shoulder-height: 1.25rem;

  display: flex;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
}

.app-header-rail-title__line {
  flex: 1 1 0;
  min-width: 0;
  height: var(--app-border-width-thin);
  margin-top: calc(var(--cp-header-rail-title-shoulder-height) / 2);
  background: var(--app-color-border-contrast);
  opacity: var(--cp-header-rail-title-line-opacity);
}

.app-header-rail-title__accent {
  flex: 0 0 auto;
  width: var(--app-space-1);
  height: var(--app-space-1);
  margin-top: calc(var(--cp-header-rail-title-shoulder-height) / 2 - var(--app-space-1) / 2);
  margin-inline: var(--app-space-2);
  border-radius: 50%;
  background: var(--app-color-primary);
}

.app-header-rail-title__shoulder {
  flex: 0 0 var(--cp-header-rail-title-shoulder-width);
  width: var(--cp-header-rail-title-shoulder-width);
  height: var(--cp-header-rail-title-shoulder-height);
  border-bottom: var(--app-border-width-thin) var(--app-border-style-solid) var(--app-color-border-contrast);
  opacity: var(--cp-header-rail-title-line-opacity);
}

.app-header-rail-title__shoulder--left {
  transform: skewX(45deg);
  transform-origin: right bottom;
}

.app-header-rail-title__shoulder--right {
  transform: skewX(-45deg);
  transform-origin: left bottom;
}

.app-header-rail-title__frame {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: 100%;
  padding: 0 var(--app-space-5) var(--app-space-2);
  border-bottom: var(--app-border-width-thin) var(--app-border-style-solid) var(--app-color-border-contrast);
}

.app-header-rail-title__title {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
