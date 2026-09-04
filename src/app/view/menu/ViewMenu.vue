<script setup lang="ts">
import { useRouter } from 'vue-router';

import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppHoldAction from '@/app/shared/components/interaction/hold/AppHoldAction.vue';
import AppButton from '@/app/shared/components/ui/button/AppButton.vue';

const router = useRouter();

function handlePlay() {
  void router.push({ name: KEY_ROUTE.game.index });
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
      <AppHoldAction :actions="{ complete: handlePlay }">
        <template #default="{ progress }">
          <AppButton
            :progress="progress"
            text="Играть"
            width="42rem"
            max-width="100%"
            size="big"
          />
        </template>
      </AppHoldAction>

      <AppHoldAction :actions="{ complete: handleSettings }">
        <template #default="{ progress }">
          <AppButton
            :progress="progress"
            text="Настройки"
            width="42rem"
            max-width="100%"
            size="big"
          />
        </template>
      </AppHoldAction>
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
