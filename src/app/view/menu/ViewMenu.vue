<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import { useHeaderActions } from '@/app/layouts/composables/common/useHeaderActions';
import { useSessionJoinOverlay } from '@/app/overlay/sessionJoin/composables/useSessionJoinOverlay';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';

const router = useRouter();
const { open: openSessionJoin } = useSessionJoinOverlay();
const menuLocale = useLocale((locale) => locale.views.menu.index.ui);

function handleSettings() {
  router.push({ name: KEY_ROUTE.settings.index });
}

useHeaderActions(
  computed(() => [
    {
      key: 'connection',
      text: menuLocale.value.connection,
      onClick: openSessionJoin,
    },
    {
      key: 'settings',
      text: menuLocale.value.settings,
      onClick: handleSettings,
    },
  ]),
);
</script>

<template>
  <ViewLayout align="center" justify="center" padding="none">
    Меню
  </ViewLayout>
</template>
