<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

import { safeAreaTokenVar } from '@/app/styles/contracts/safeArea.contract';

const route = useRoute();

const layoutStyle = computed(() => {
  const safeAreaPadding = `${safeAreaTokenVar('vertical')} ${safeAreaTokenVar('horizontal')}`;

  return {
    '--cp-layout-padding': route.meta.safeArea === false ? '0' : safeAreaPadding,
  };
});
</script>

<template>
  <main
    class="layout"
    :style="layoutStyle"
  >
    <div class="layout-header">
      тестовый хедер
    </div>
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
