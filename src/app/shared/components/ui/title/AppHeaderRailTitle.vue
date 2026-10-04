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
      <span class="app-header-rail-title__diagonal" />
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
      <span class="app-header-rail-title__diagonal" />
      <span class="app-header-rail-title__dot" />
    </span>

    <span class="app-header-rail-title__line" aria-hidden="true" />
  </div>
</template>

<style scoped>
.app-header-rail-title {
  --cp-header-rail-title-line-color: var(--app-color-text-tertiary);
  --cp-header-rail-title-line-width: var(--app-border-width-thin);
  --cp-header-rail-title-junction-y: 50%;
  --cp-header-rail-title-connector-width: 2.5rem;
  --cp-header-rail-title-diagonal-length: 3.875rem;
  --cp-header-rail-title-diagonal-angle: 49.75deg;
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
  height: var(--cp-header-rail-title-line-width);
  background: var(--cp-header-rail-title-line-color);
}

.app-header-rail-title__connector {
  position: relative;
  flex: 0 0 var(--cp-header-rail-title-connector-width);
  width: var(--cp-header-rail-title-connector-width);
}

.app-header-rail-title__diagonal {
  position: absolute;
  top: var(--cp-header-rail-title-junction-y);
  z-index: 0;
  width: var(--cp-header-rail-title-diagonal-length);
  height: var(--cp-header-rail-title-line-width);
  background: var(--cp-header-rail-title-line-color);
}

.app-header-rail-title__connector--left .app-header-rail-title__diagonal {
  left: 0;
  transform: translateY(-50%) rotate(var(--cp-header-rail-title-diagonal-angle));
  transform-origin: left center;
}

.app-header-rail-title__connector--right .app-header-rail-title__diagonal {
  right: 0;
  transform: translateY(-50%) rotate(calc(var(--cp-header-rail-title-diagonal-angle) * -1));
  transform-origin: right center;
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
  border-bottom: var(--cp-header-rail-title-line-width)
    var(--app-border-style-solid)
    var(--cp-header-rail-title-line-color);
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
