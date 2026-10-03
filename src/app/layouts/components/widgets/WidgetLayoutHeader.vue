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
    <AppFlex align="center" justify="between" width="100%">
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

  display: flex;
  align-items: center;
  width: 100%;
  padding:
    calc(var(--cp-layout-padding-vertical, 0px) + var(--app-space-2))
    var(--cp-layout-padding-horizontal, 0px)
    var(--app-space-2);
  border-bottom: var(--app-border-width-thin) var(--app-border-style-solid) var(--app-color-border-strong);
  background: var(--app-color-surface-glass);
  -webkit-backdrop-filter: blur(1.2rem) saturate(115%);
  backdrop-filter: blur(1.2rem) saturate(115%);
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
