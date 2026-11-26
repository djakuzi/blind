<script setup lang="ts">
import { useLocale } from '@/app/features/locale/composables/useLocale';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppText from '@/app/shared/components/elements/typography/AppText.vue';
import AppTitle from '@/app/shared/components/elements/typography/AppTitle.vue';

const lobbyLocale = useLocale((locale) => locale.views.lobby.index.ui);
</script>

<template>
  <ViewLayout align="center" justify="center" padding="none">
    <AppFlex direction="column" align="center" :gap="4">
      <AppTitle :text="lobbyLocale.title" tag="h1" />
      <AppText :text="lobbyLocale.demo" tag="p" />
    </AppFlex>
  </ViewLayout>
</template>
