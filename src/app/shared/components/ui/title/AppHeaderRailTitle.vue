<script setup lang="ts">
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import type { PropsAppTitle } from '@/app/shared/components/atoms/typography/AppTitle.vue';

export interface PropsAppHeaderRailTitle extends PropsAppTitle {}

const props = defineProps<PropsAppHeaderRailTitle>();
</script>

<template>
  <div class="app-header-rail-title">
    <span class="app-header-rail-title__line" aria-hidden="true" />

    <span
      class="app-header-rail-title__connector app-header-rail-title__connector--left"
      aria-hidden="true"
    >
      <svg
        class="app-header-rail-title__connector-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="0" x2="100" y2="100" />
      </svg>

      <span class="app-header-rail-title__dot" />
    </span>

    <div class="app-header-rail-title__frame">
      <AppTitle
        class="app-header-rail-title__title"
        v-bind="props"
      />
    </div>

    <span
      class="app-header-rail-title__connector app-header-rail-title__connector--right"
      aria-hidden="true"
    >
      <svg
        class="app-header-rail-title__connector-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="100" x2="100" y2="0" />
      </svg>

      <span class="app-header-rail-title__dot" />
    </span>

    <span class="app-header-rail-title__line" aria-hidden="true" />
  </div>
</template>

<style scoped>
.app-header-rail-title {
  --cp-header-rail-title-line-color: var(--app-color-text-tertiary);
  --cp-header-rail-title-junction-y: 50%;
  --cp-header-rail-title-connector-width: 2.5rem;
  --cp-header-rail-title-dot-size: 0.5rem;

  display: flex;
  align-items: stretch;
  width: 100%;
  min-width: 0;
}

.app-header-rail-title__line {
  align-self: center;
  flex: 1 1 0;
  min-width: 0;
  height: var(--app-border-width-thin);
  background: var(--cp-header-rail-title-line-color);
}

.app-header-rail-title__connector {
  position: relative;
  flex: 0 0 var(--cp-header-rail-title-connector-width);
  width: var(--cp-header-rail-title-connector-width);
  min-height: 100%;
}

.app-header-rail-title__connector-svg {
  position: absolute;
  top: var(--cp-header-rail-title-junction-y);
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  width: 100%;
  height: calc(100% - var(--cp-header-rail-title-junction-y));
  overflow: visible;
}

.app-header-rail-title__connector-svg line {
  stroke: var(--cp-header-rail-title-line-color);
  stroke-width: var(--app-border-width-thin);
  vector-effect: non-scaling-stroke;
}

.app-header-rail-title__dot {
  position: absolute;
  top: var(--cp-header-rail-title-junction-y);
  z-index: 1;
  width: var(--cp-header-rail-title-dot-size);
  height: var(--cp-header-rail-title-dot-size);
  border-radius: 50%;
  background: var(--app-color-primary);
}

.app-header-rail-title__connector--left .app-header-rail-title__dot {
  left: 0;
  transform: translate(-50%, -50%);
}

.app-header-rail-title__connector--right .app-header-rail-title__dot {
  right: 0;
  transform: translate(50%, -50%);
}

.app-header-rail-title__frame {
  display: flex;
  flex: 0 1 auto;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
  max-width: 100%;
  padding: 0 var(--app-space-5) var(--app-space-2);
  border-bottom: var(--app-border-width-thin) var(--app-border-style-solid) var(--cp-header-rail-title-line-color);
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
</style>
