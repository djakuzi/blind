<script setup lang="ts">
import { RouterView } from 'vue-router';
import ProviderLoaderApp from '@/app/providers/ProviderLoaderApp.vue';
import { useLoaderStore } from '@/app/stores/loader/loader.store';
import '@/app/styles/index.css';

const loaderStore = useLoaderStore();
</script>

<template>
  <RouterView
    v-if="loaderStore.isLoaded"
    key="app-router"
  />
  <ProviderLoaderApp />
</template>
