<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppGrid from '@/app/shared/components/atoms/block/AppGrid.vue';
import AppPosition from '@/app/shared/components/atoms/layer/AppPosition.vue';
import AppLineLoader from '@/app/shared/components/ui/loader/AppLineLoader.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';
import AppVersion from '@/app/shared/components/ui/version/AppVersion.vue';

type tWidgetLoaderPhase = 'loading' | 'complete' | 'leaving';

interface Props {
  isLoading?: boolean
  progress?: number
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  progress: 0,
  text: 'Загрузка',
});

const isRendered = ref(props.isLoading);
const phase = ref<tWidgetLoaderPhase>('loading');

const loaderClass = computed(() => [
  'widget-loader-app',
  `widget-loader-app--${phase.value}`,
]);

watch(
  () => props.isLoading,
  (isLoading) => {
    if (!isLoading) {
      phase.value = 'complete';

      return;
    }

    isRendered.value = true;
    phase.value = 'loading';
  },
  { immediate: true },
);

function handleLoaderProgressComplete() {
  if (props.isLoading || phase.value !== 'complete') {
    return;
  }

  phase.value = 'leaving';
}

function handleLoaderAnimationEnd() {
  if (phase.value !== 'leaving') {
    return;
  }

  isRendered.value = false;
}
</script>

<template>
  <AppPosition
    :is-show="isRendered"
    type="fixed"
    layer="overlay"
    :position="{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }"
  >
    <AppGrid
      :class="loaderClass"
      place-items="center"
      min-height="100dvh"
      @animationend="handleLoaderAnimationEnd"
    >
      <AppFlex
        class="widget-loader-app__content"
        direction="column"
        align="center"
        max-width="100%"
        width="100%"
      >
        <AppLogo
          logo="blindTextRight"
          width="100rem"
          height="auto"
        />

        <AppLineLoader
          :progress="progress"
          :text="text"
          size="big"
          width="70rem"
          max-width="100%"
          @complete="handleLoaderProgressComplete"
        />
      </AppFlex>

      <AppPosition
        type="absolute"
        :position="{
          right: 'horizontal',
          bottom: 'vertical',
        }"
      >
        <AppVersion
          class="widget-loader-app__version"
          size="big"
        />
      </AppPosition>
    </AppGrid>
  </AppPosition>
</template>

<style scoped>
.widget-loader-app {
  position: relative;
  overflow: hidden;
  padding: var(--app-safe-area-vertical) var(--app-safe-area-horizontal);
  background: var(--app-color-background);
}

.widget-loader-app--leaving {
  animation: widget-loader-app-leave 320ms ease forwards;
}

.widget-loader-app__content {
  gap: var(--app-space-5);;
  transform: translateY(-2dvh);
}

@keyframes widget-loader-app-leave {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
