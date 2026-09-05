<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';

import WidgetLayoutHeader from '@/app/layouts/components/widgets/WidgetLayoutHeader.vue';
import { useLayoutHeader } from '@/app/layouts/composables/common/useLayoutHeader';
import { useLayoutPadding } from '@/app/layouts/composables/common/useLayoutPadding';
import AppTransitionHeader from '@/app/shared/components/effects/transition/AppTransitionHeader.vue';
import AppTransitionScreen from '@/app/shared/components/effects/transition/AppTransitionScreen.vue';

const { hasLayoutHeader } = useLayoutHeader();
const { layoutPadding } = useLayoutPadding();

const layoutStyle = computed(() => ({
  '--cp-layout-padding': layoutPadding.value,
}));
</script>

<template>
  <main
    class="layout"
    :style="layoutStyle"
  >
    <AppTransitionHeader :show="hasLayoutHeader">
      <WidgetLayoutHeader />
    </AppTransitionHeader>

    <RouterView v-slot="{ Component, route }">
      <AppTransitionScreen>
        <component
          :is="Component"
          :key="route.name ?? route.path"
        />
      </AppTransitionScreen>
    </RouterView>
  </main>
</template>

<style scoped>
.layout {
  display: flex;
  flex: 1;
  flex-direction: column;

  width: 100%;
  min-height: 100dvh;
  max-height: 100dvh;

  padding: var(--cp-layout-padding);
  overflow: hidden;
}
</style>