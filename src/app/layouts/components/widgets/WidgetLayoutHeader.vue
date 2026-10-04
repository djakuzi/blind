<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import { useLayoutHeader } from '@/app/layouts/composables/common/useLayoutHeader';
import { useAudio } from '@/app/shared/composables/audio/useAudio';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppButtonIcon from '@/app/shared/components/ui/button/AppButtonIcon.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';
import AppHeaderRailTitle from '@/app/shared/components/ui/title/AppHeaderRailTitle.vue';

const router = useRouter();
const { play } = useAudio();

const commonLocale = useLocale((locale) => locale.common);
const { hasLayoutHeaderTitle, layoutHeaderTitle, hasLayoutHeaderLogo } = useLayoutHeader();

function handleBack() {
  play('sfx.navigation.back');
  router.back();
}
</script>

<template>
  <header class="layout-header">
    <AppFlex class="layout-header__content" align="center" justify="between" width="100%">
      <AppButtonIcon
        class="layout-header__back"
        group="back"
        icon="backArrow"
        width="var(--cp-layout-header-control-size)"
        height="var(--cp-layout-header-control-size)"
        :ariaLabel="commonLocale.navigation.back"
        @click="handleBack"
      />

      <AppHeaderRailTitle
        v-if="hasLayoutHeaderTitle"
        class="layout-header__title"
        :text="layoutHeaderTitle"
        font-size="xl"
      />

      <AppLogo
        v-else-if="hasLayoutHeaderLogo"
        class="layout-header__logo"
        size="small"
      />

      <span class="layout-header__spacer" aria-hidden="true" />
    </AppFlex>
  </header>
</template>

<style scoped>
.layout-header {
  --cp-layout-header-control-size: 7.5rem;

  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  width: 100%;
  padding:
    var(--cp-layout-padding-vertical, 0px)
    var(--cp-layout-padding-horizontal, 0px)
    var(--app-space-2);
}

.layout-header::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  -webkit-backdrop-filter: blur(1.5rem) saturate(145%);
  backdrop-filter: blur(1.5rem) saturate(145%);
  -webkit-mask-image: linear-gradient(
    180deg,
    #000 0%,
    rgba(0, 0, 0, 0.78) 42%,
    transparent 100%
  );
  mask-image: linear-gradient(
    180deg,
    #000 0%,
    rgba(0, 0, 0, 0.78) 42%,
    transparent 100%
  );
}

.layout-header::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    var(--app-color-surface-glass-top) 0%,
    var(--app-color-surface-glass-bottom) 100%
  );
  box-shadow: inset 0 1px 0 var(--app-color-surface-glass-highlight);
}

.layout-header__content {
  position: relative;
  z-index: 2;
}

.layout-header__title {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 96rem;
  margin-inline: var(--app-space-6);
}

.layout-header__spacer {
  width: var(--cp-layout-header-control-size);
  height: var(--cp-layout-header-control-size);
  pointer-events: none;
}
</style>
