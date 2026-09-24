<script setup lang="ts">
import { useLocale } from '@/app/features/locale/composables/useLocale';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';

const typeConnectionLocale = useLocale(
  locale => locale.views.preGame.typeConnection.ui,
);
</script>

<template>
  <ViewLayout
    align="center"
    justify="center"
  >
    {{ typeConnectionLocale.title }}
  </ViewLayout>
</template>
