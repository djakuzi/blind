<script setup lang="ts">
import { RouterView } from 'vue-router';
import ProviderLoaderApp from '@/app/providers/ProviderLoaderApp.vue';
import { useAppBootstrapLoader } from './useAppBootstrapLoader';
import '@/app/styles/index.css';

useAppBootstrapLoader();
</script>

<template>
  <RouterView key="app-router" />
  <ProviderLoaderApp />
</template>
