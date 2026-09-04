<script setup lang="ts">
import { useRouter } from 'vue-router';

import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppButton from '@/app/shared/components/ui/button/AppButton.vue';

const router = useRouter();

function handlePlay() {
  // void router.push({ name: KEY_ROUTE.game.index });
}

function handleSettings() {
  void router.push({ name: KEY_ROUTE.settings.index });
}
</script>

<template>
  <ViewLayout
    class="view-menu"
    align="center"
    justify="center"
    padding="none"
  >
    <div class="view-menu__nav">
      <AppButton
        :actions="{ complete: handlePlay }"
        text="Играть"
        width="42rem"
        max-width="100%"
        size="big"
      />

      <AppButton
        :actions="{ complete: handleSettings }"
        text="Настройки"
        width="42rem"
        max-width="100%"
        size="big"
      />
    </div>
  </ViewLayout>
</template>

<style scoped>
.view-menu__nav {
  display: flex;
  flex-direction: column;
  width: min(100%, 42rem);
  gap: var(--app-space-10);
}
</style>
