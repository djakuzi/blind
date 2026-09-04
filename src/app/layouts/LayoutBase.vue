<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

import WidgetLayoutHeader from '@/app/layouts/components/widgets/WidgetLayoutHeader.vue';
import { resolveLayoutPadding } from '@/app/layouts/composables/common/useLayoutPadding';

const route = useRoute();

const hasLayoutHeader = computed(() => route.meta.header !== false);

const layoutStyle = computed(() => {
  return {
    '--cp-layout-padding': resolveLayoutPadding(route.meta.safeArea ?? true),
  };
});
</script>

<template>
  <main
    class="layout"
    :style="layoutStyle"
  >
    <WidgetLayoutHeader v-if="hasLayoutHeader" />
    <RouterView />
  </main>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  min-height: 100dvh;
  max-height: 100dvh;
  box-sizing: border-box;
  padding: var(--cp-layout-padding);
}
</style>
