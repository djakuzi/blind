<script setup lang="ts">
import AppPosition from '@/app/shared/components/atoms/layer/AppPosition.vue';
import { useLoaderProvider } from '@/app/overlay/loader/composables/useLoaderProvider';
import WidgetLoaderApp from '@/app/overlay/loader/widgets/WidgetLoaderApp.vue';

const loader = useLoaderProvider();
</script>

<template>
  <AppPosition
    :is-show="loader.isInteractionBlocked.value"
    class="provider-loader-app__blocker"
    type="fixed"
    layer="loader"
    :position="{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }"
  />

  <WidgetLoaderApp
    :is-visible="loader.isVisible.value"
    :progress="loader.progress.value"
    :progress-mode="loader.progressMode.value"
    :text="loader.text.value"
    :error="loader.error.value"
    @hidden="loader.handleHidden"
  />
</template>

<style scoped>
.provider-loader-app__blocker {
  background: transparent;
}
</style>
