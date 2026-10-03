<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import { useLayoutHeader } from '@/app/layouts/composables/common/useLayoutHeader';
import { useAudio } from '@/app/shared/composables/audio/useAudio';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import AppButtonIcon from '@/app/shared/components/ui/button/AppButtonIcon.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';

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

      <AppTitle
        v-if="hasLayoutHeaderTitle"
        class="layout-header__title"
        :text="layoutHeaderTitle"
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
}

.layout-header__title {
  min-width: 0;
  text-align: center;
}

.layout-header__spacer {
  width: var(--cp-layout-header-control-size);
  height: var(--cp-layout-header-control-size);
  pointer-events: none;
}
</style>
