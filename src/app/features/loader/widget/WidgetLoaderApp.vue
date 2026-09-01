<script setup lang="ts">
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppGrid from '@/app/shared/components/atoms/block/AppGrid.vue';
import AppPosition from '@/app/shared/components/atoms/layer/AppPosition.vue';
import AppLineLoader from '@/app/shared/components/ui/loader/AppLineLoader.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';
import AppVersion from '@/app/shared/components/ui/version/AppVersion.vue';

interface Props {
  isShow?: boolean
  progress?: number
  text?: string
}

withDefaults(defineProps<Props>(), {
  isShow: false,
  progress: 0,
  text: 'Загрузка',
});
</script>

<template>
  <AppPosition
    :is-show="isShow"
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
      class="widget-loader-app"
      place-items="center"
      min-height="100dvh"
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
          size="big"
          width="clamp(20rem, 75vw, 60rem)"
          height="auto"
        />

        <AppLineLoader
          :progress="progress"
          :text="text"
          size="middle"
          width="min(40vw, 30rem)"
          max-width="100%"
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

.widget-loader-app__content {
  gap: clamp(var(--app-space-8), 7.5dvh, var(--app-space-10));
  transform: translateY(-2dvh);
}
</style>
