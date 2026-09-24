<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAppSetup } from '@/app/setup/composables/useAppSetup';
import ProviderLoaderApp from '@/app/providers/ProviderLoaderApp.vue';
import '@/app/styles/index.css';

const appSetup =
  useAppSetup();
</script>

<template>
  <RouterView
    v-if="appSetup.isReady.value"
    key="app-router"
  />
  <ProviderLoaderApp />
</template>
