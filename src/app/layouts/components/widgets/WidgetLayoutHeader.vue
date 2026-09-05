<script setup lang="ts">
import { useRouter } from 'vue-router';

import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppButtonIcon from '@/app/shared/components/ui/button/AppButtonIcon.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';

const router = useRouter();

function handleBack() {
  router.back();
}
</script>

<template>
  <header class="layout-header">
    <AppFlex
      class="layout-header__content"
      align="center"
      justify="between"
      width="100%"
    >
      <AppButtonIcon
        class="layout-header__back"
        group="back"
        icon="backArrow"
        width="var(--cp-layout-header-control-size)"
        height="var(--cp-layout-header-control-size)"
        ariaLabel="Назад"
        @click="handleBack"
      />

      <AppLogo
        class="layout-header__logo"
        size="middle"
      />

      <span
        class="layout-header__spacer"
        aria-hidden="true"
      />
    </AppFlex>
  </header>
</template>

<style scoped>
.layout-header {
  --cp-layout-header-control-size: 7.5rem;

  display: flex;
  flex: 0 0 auto;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.layout-header__content {
  min-width: 0;
}

.layout-header__back,
.layout-header__spacer {
  flex: 0 0 var(--cp-layout-header-control-size);
}

.layout-header__logo {
  flex: 0 1 auto;
}

.layout-header__spacer {
  width: var(--cp-layout-header-control-size);
  height: var(--cp-layout-header-control-size);
  pointer-events: none;
}
</style>