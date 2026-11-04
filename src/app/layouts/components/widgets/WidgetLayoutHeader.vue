<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import { useAudio } from '@/app/shared/composables/audio/useAudio';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppButtonIcon from '@/app/shared/components/ui/button/AppButtonIcon.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';

const router = useRouter();
const { play } = useAudio();

const commonLocale = useLocale((locale) => locale.common);

function handleBack() {
  play('sfx.navigation.back');
  router.back();
}
</script>

<template>
  <header class="layout-header">
    <AppFlex align="center" :gap="4" width="100%">
      <AppButtonIcon
        group="back"
        icon="backArrow"
        width="var(--cp-layout-header-control-size)"
        height="var(--cp-layout-header-control-size)"
        :ariaLabel="commonLocale.navigation.back"
        @click="handleBack"
      />

      <AppLogo size="small" />
    </AppFlex>
  </header>
</template>

<style scoped>
.layout-header {
  --cp-layout-header-control-size: 7.5rem;

  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--cp-layout-padding-vertical, 0px) var(--cp-layout-padding-horizontal, 0px) var(--app-space-2);
}
</style>
