<script setup lang="ts">
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppGrid from '@/app/shared/components/atoms/block/AppGrid.vue';
import AppPosition from '@/app/shared/components/atoms/layer/AppPosition.vue';
import AppLineLoader from '@/app/shared/components/ui/loader/AppLineLoader.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';
import AppVersion from '@/app/shared/components/ui/version/AppVersion.vue';
</script>

<template>
  <AppPosition
    :is-show="true"
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
      class="provider-loader-app"
      place-items="center"
      min-height="100dvh"
    >
      <AppFlex
        class="provider-loader-app__content"
        direction="column"
        align="center"
        max-width="100%"
        width="100%"
      >
        <AppLogo
          logo="blindTextRight"
          size="big"
          width="clamp(20rem, 78vw, 60rem)"
          height="auto"
        />

        <AppLineLoader
          :progress="68"
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
          class="provider-loader-app__version"
          size="big"
        />
      </AppPosition>
    </AppGrid>
  </AppPosition>
</template>

<style scoped>
.provider-loader-app {
  position: relative;
  overflow: hidden;
  padding: var(--app-safe-area-vertical) var(--app-safe-area-horizontal);
  background: var(--app-color-background);
}

.provider-loader-app__content {
  gap: clamp(var(--app-space-8), 7.5dvh, var(--app-space-10));
  transform: translateY(-2dvh);
}
</style>
