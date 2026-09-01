<script setup lang="ts">
import { nextTick, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useLoaderRegistry } from '@/app/features/loader/composables/useLoaderRegistry';
import ProviderLoaderApp from '@/app/providers/ProviderLoaderApp.vue';
import '@/app/styles/index.css';

const APP_BOOTSTRAP_SCOPE_KEY = 'app-bootstrap';
const APP_BOOTSTRAP_RESOURCES = {
  rootMounted: 'rootMounted',
  firstRenderFrame: 'firstRenderFrame',
} as const;

const loaderRegistry = useLoaderRegistry();

loaderRegistry.registerScope({
  scopeKey: APP_BOOTSTRAP_SCOPE_KEY,
  title: 'Загрузка',
  resources: {
    [APP_BOOTSTRAP_RESOURCES.rootMounted]: false,
    [APP_BOOTSTRAP_RESOURCES.firstRenderFrame]: false,
  },
});

function setBootstrapResourceLoaded(resourceKey: string) {
  loaderRegistry.setResourceState({
    scopeKey: APP_BOOTSTRAP_SCOPE_KEY,
    resourceKey,
    isLoaded: true,
  });
}

onMounted(async () => {
  setBootstrapResourceLoaded(APP_BOOTSTRAP_RESOURCES.rootMounted);

  await nextTick();

  requestAnimationFrame(() => {
    setBootstrapResourceLoaded(APP_BOOTSTRAP_RESOURCES.firstRenderFrame);
  });
});
</script>

<template>
  <RouterView key="app-router" />
  <ProviderLoaderApp />
</template>
