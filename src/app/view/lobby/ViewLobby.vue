<script setup lang="ts">
import { useLocale } from '@/app/features/locale/composables/useLocale';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';

const lobbyLocale = useLocale((locale) => locale.views.lobby.index.ui);
</script>

<template>
  <ViewLayout align="center" justify="center" padding="none">
    <AppTitle :text="lobbyLocale.title" tag="h1" />
  </ViewLayout>
</template>
