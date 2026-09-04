<script setup lang="ts">
import { useRouter } from 'vue-router';

import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppButtonHold from '@/app/shared/components/ui/button/AppButtonHold.vue';
import AppHoldHint from '@/app/shared/components/ui/hint/AppHoldHint.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';
import AppVersion from '@/app/shared/components/ui/version/AppVersion.vue';

const router = useRouter();

function handlePlay() {
  router.push({ name: KEY_ROUTE.game.index });
}

function handleSettings() {
  router.push({ name: KEY_ROUTE.settings.index });
}
</script>

<template>
  <ViewLayout
    class="view-menu"
    align="center"
    justify="center"
    padding="none"
  >
    <div class="view-menu__content">
      <AppLogo
        class="view-menu__logo"
        size="big"
        logo="blindTextRight"
        width="41rem"
      />

      <div class="view-menu__nav">
        <AppButtonHold
          :actions="{ complete: handlePlay }"
          text="Играть"
          width="42rem"
          max-width="100%"
          size="big"
        />

        <AppButtonHold
          :actions="{ complete: handleSettings }"
          text="Настройки"
          width="42rem"
          max-width="100%"
          size="big"
        />
      </div>

      <AppHoldHint class="view-menu__hint" />
    </div>

    <AppVersion
      class="view-menu__version"
      size="big"
    />
  </ViewLayout>
</template>

<style scoped>
.view-menu {
  position: relative;
}

.view-menu__content {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: min(100%, 46rem);
  min-width: 0;
  padding: var(--app-space-8) var(--app-space-4);
}

.view-menu__logo {
  margin-bottom: var(--app-space-20);
}

.view-menu__nav {
  display: flex;
  flex-direction: column;
  width: min(100%, 42rem);
  gap: var(--app-space-8);
}

.view-menu__hint {
  margin-top: var(--app-space-16);
}

.view-menu__version {
  position: absolute;
  right: max(var(--app-space-6), var(--app-safe-area-right));
  bottom: max(var(--app-space-5), var(--app-safe-area-bottom));
}

@media (max-height: 42rem) {
  .view-menu__content {
    padding-block: var(--app-space-4);
  }

  .view-menu__logo {
    width: 30rem;
    margin-bottom: var(--app-space-8);
  }

  .view-menu__nav {
    gap: var(--app-space-5);
  }

  .view-menu__hint {
    margin-top: var(--app-space-8);
  }
}
</style>
