<script setup lang="ts">
import { computed } from 'vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { useLanguageStore } from '@/app/stores/language/language.store';

const languageStore = useLanguageStore();

const typeConnectionLocale = computed(() => {
  if (!languageStore.locale) {
    throw new Error('Locale is not initialized');
  }

  return languageStore.locale.views.preGame.typeConnection.ui;
});
</script>

<template>
  <ViewLayout
    align="center"
    justify="center"
  >
    {{ typeConnectionLocale.title }}
  </ViewLayout>
</template>
