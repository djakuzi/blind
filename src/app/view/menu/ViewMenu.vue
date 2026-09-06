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

const menuActions = [
  {
    key: 'play',
    text: 'Играть',
    actions: {
      complete: handlePlay,
    },
  },
  {
    key: 'settings',
    text: 'Настройки',
    actions: {
      complete: handleSettings,
    },
  },
];
</script>

<template>
  <ViewLayout
    class="view-menu"
    align="center"
    justify="center"
    padding="none"
  >
    <AppFlex
      direction="column"
      align="center"
      width="100%"
      :gap="16"
    >
      <AppLogo
        size="big"
        logo="blindTextRight"
        width="80rem"
        height="auto"
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
          v-for="menuAction in menuActions"
          :key="menuAction.key"
          :actions="menuAction.actions"
          :text="menuAction.text"
          width="40rem"
          size="big"
        />
      </AppFlex>

      <AppHoldHint text="Удерживайте, чтобы начать" />
    </AppFlex>

    <AppPosition
      type="absolute"
      :position="{
        right: '0',
        bottom: '0',
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
</style>
