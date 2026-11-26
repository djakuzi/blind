<script setup lang="ts">
import { RouterView } from 'vue-router';
import ProviderLoaderApp from '@/app/providers/ProviderLoaderApp.vue';
import '@/app/shared/styles/index.css';
import { useSetupLifecycle } from '@/core/app/setup/lifecycle/useSetupLifecycle';

const setup = useSetupLifecycle();
</script>

<template>
  <RouterView v-if="setup.isReady.value" key="app-router" />
  <ProviderLoaderApp />
</template>
