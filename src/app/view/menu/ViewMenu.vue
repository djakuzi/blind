<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import { useSessionJoinOverlay } from '@/app/overlay/sessionJoin/composables/useSessionJoinOverlay';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppButtonHold from '@/app/shared/components/ui/button/AppButtonHold.vue';
import AppHoldHint from '@/app/shared/components/ui/hint/AppHoldHint.vue';
import AppLogo from '@/app/shared/components/ui/logo/AppLogo.vue';

const router = useRouter();
const { open: openSessionJoin } = useSessionJoinOverlay();

const menuLocale = useLocale((locale) => locale.views.menu.index.ui);

function handlePlay() {
  router.push({ name: KEY_ROUTE.preGame.index });
}

function handleJoin() {
  openSessionJoin();
}

function handleSettings() {
  router.push({ name: KEY_ROUTE.settings.index });
}

const menuActions = computed(() => [
  {
    key: 'play',
    text: menuLocale.value.play,
    actions: {
      complete: handlePlay,
    },
  },
  {
    key: 'join',
    text: menuLocale.value.join,
    actions: {
      complete: handleJoin,
    },
  },
  {
    key: 'settings',
    text: menuLocale.value.settings,
    actions: {
      complete: handleSettings,
    },
  },
]);
</script>

<template>
  <ViewLayout class="view-menu" align="center" justify="center" padding="none">
    <AppFlex direction="column" align="center" width="100%" :gap="8">
      <AppLogo size="big" logo="blindTextRight" width="85rem" height="auto" />

      <AppFlex class="view-menu__nav" direction="column" justify="center" align="stretch" :gap="8" width="max-content" max-width="100%">
        <AppButtonHold
          v-for="menuAction in menuActions"
          :key="menuAction.key"
          :actions="menuAction.actions"
          :text="menuAction.text"
          width="100%"
          max-width="100%"
          size="big"
          :reset-on-complete="menuAction.key === 'join'"
        />
      </AppFlex>

      <AppHoldHint :text="menuLocale.holdHint" />
    </AppFlex>
  </ViewLayout>
</template>

<style scoped>
.view-menu {
  position: relative;
}
</style>
