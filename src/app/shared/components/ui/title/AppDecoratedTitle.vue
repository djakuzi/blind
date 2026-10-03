<script setup lang="ts">
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import type { PropsAppTitle } from '@/app/shared/components/atoms/typography/AppTitle.vue';

export interface PropsAppDecoratedTitle extends PropsAppTitle {}

const props = defineProps<PropsAppDecoratedTitle>();
</script>

<template>
  <div class="app-decorated-title">
    <span class="app-decorated-title__line" aria-hidden="true" />
    <span class="app-decorated-title__accent" aria-hidden="true" />

    <AppTitle
      class="app-decorated-title__title"
      v-bind="props"
    />

    <span class="app-decorated-title__accent" aria-hidden="true" />
    <span class="app-decorated-title__line" aria-hidden="true" />
  </div>
</template>

<style scoped>
.app-decorated-title {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: var(--app-space-3);
}

.app-decorated-title__line {
  flex: 1 1 0;
  min-width: 0;
  height: var(--app-border-width-thin);
  background: var(--app-color-border-contrast);
  opacity: 0.55;
}

.app-decorated-title__accent {
  flex: 0 0 auto;
  width: var(--app-space-1);
  height: var(--app-space-1);
  border-radius: 50%;
  background: var(--app-color-primary);
}

.app-decorated-title__title {
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
