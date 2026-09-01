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
        max-width="calc(47.5rem * var(--app-scale))"
      >
        <AppLogo
          class="provider-loader-app__logo"
          logo="blindTextRight"
          size="big"
          width="clamp(calc(20rem * var(--app-scale)), 48vw, calc(40rem * var(--app-scale)))"
          height="auto"
        />

        <AppLineLoader
          class="provider-loader-app__line"
          :progress="68"
          size="middle"
          width="min(43vw, calc(45rem * var(--app-scale)))"
          max-width="100%"
        />
      </AppFlex>

      <AppVersion
        class="provider-loader-app__version"
        size="big"
      />
    </AppGrid>
  </AppPosition>
</template>

<style scoped>
.provider-loader-app {
  position: relative;
  overflow: hidden;
  padding: var(--app-space-24);
  background: var(--app-color-background);
}

.provider-loader-app__content {
  width: 100%;
  gap: clamp(
    calc(4rem * var(--app-scale)),
    8dvh,
    calc(6rem * var(--app-scale))
  );
  transform: translateY(-2dvh);
}

.provider-loader-app__line {
  min-width: min(100%, calc(17.5rem * var(--app-scale)));
}

.provider-loader-app__version {
  position: absolute;
  right: max(var(--app-space-24), env(safe-area-inset-right));
  bottom: max(var(--app-space-24), env(safe-area-inset-bottom));
}

@media (max-width: 640px) {
  .provider-loader-app__content {
    gap: var(--app-space-24);
  }
}
</style>
