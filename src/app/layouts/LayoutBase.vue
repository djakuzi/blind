<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';

import AppTransitionHeader from '@/app/layouts/components/transition/AppTransitionHeader.vue';
import AppTransitionScreen from '@/app/layouts/components/transition/AppTransitionScreen.vue';
import WidgetLayoutHeader from '@/app/layouts/components/widgets/WidgetLayoutHeader.vue';

import { useLayoutHeader } from '@/app/layouts/composables/common/useLayoutHeader';
import { useLayoutPadding } from '@/app/layouts/composables/common/useLayoutPadding';
import { useLayoutVersion } from '@/app/layouts/composables/common/useLayoutVersion';

import AppPosition from '@/app/shared/components/atoms/layer/AppPosition.vue';
import AppVersion from '@/app/shared/components/ui/version/AppVersion.vue';

const { hasLayoutHeader } = useLayoutHeader();
const { hasLayoutVersion } = useLayoutVersion();
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

    <AppPosition
      v-if="hasLayoutVersion"
      type="absolute"
      :position="{
        right: 'vertical',
        bottom: 'vertical',
      }"
    >
      <AppVersion size="big" />
    </AppPosition>
  </main>
</template>

<style scoped>
.layout {
  position: relative;

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