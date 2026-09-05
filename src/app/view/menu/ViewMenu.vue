<script setup lang="ts">
import { useRouter } from 'vue-router';

import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppPosition from '@/app/shared/components/atoms/layer/AppPosition.vue';
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
    <AppFlex
      class="view-menu__content"
      direction="column"
      align="center"
      width="100%"
    >
      <AppLogo
        class="view-menu__logo"
        size="big"
        logo="blindTextRight"
        width="70rem"
      />

      <AppFlex
        class="view-menu__nav"
        direction="column"
        justify="center"
        align="center"
        :gap="8"
        width="100%"
      >
        <AppButtonHold
          :actions="{ complete: handlePlay }"
          text="Играть"
          width="42rem"
          size="big"
        />

        <AppButtonHold
          :actions="{ complete: handleSettings }"
          text="Настройки"
          width="42rem"
          size="big"
        />
      </AppFlex>

      <AppHoldHint class="view-menu__hint" />
    </AppFlex>

    <AppPosition
      type="absolute"
      :position="{
        right: 'horizontal',
        bottom: 'vertical',
      }"
    >
      <AppVersion size="big" />
    </AppPosition>
  </ViewLayout>
</template>

<style scoped>
.view-menu {
  position: relative;
}

.view-menu__content {
  min-width: 0;
  padding: var(--app-space-8) var(--app-space-4);
}

.view-menu__logo {
  margin-bottom: var(--app-space-20);
}

.view-menu__hint {
  margin-top: var(--app-space-16);
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
