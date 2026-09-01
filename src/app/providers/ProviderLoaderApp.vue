<script setup lang="ts">
import { useLoaderView } from '@/app/features/loader/composables/useLoaderView';
import WidgetLoaderApp from '@/app/features/loader/widget/WidgetLoaderApp.vue';

const loaderView = useLoaderView();
</script>

<template>
  <WidgetLoaderApp
    :is-loading="loaderView.isLoading.value"
    :progress="loaderView.progress.value"
    :text="loaderView.text.value"
  />
</template>
