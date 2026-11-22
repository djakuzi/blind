<script setup lang="ts">
import WidgetSettingsPanel from '@/app/features/settings/widgets/WidgetSettingsPanel.vue';
import type { tSettingsOperation } from '@/app/features/settings/widgets/WidgetSettingsPanel.vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { useLoaderRegistry } from '@/app/overlay/loader/composables/useLoaderRegistry';

const loader = useLoaderRegistry();

function handleOperation(operation: tSettingsOperation) {
  const scopeKey = `settings-${operation.key}`;
  const resource = { scopeKey, resourceKey: operation.key };

  if (operation.state === 'start') {
    loader.registerScope({
      scopeKey,
      title: operation.title,
      progressMode: 'indeterminate',
      resources: { [operation.key]: 'pending' },
    });
    return;
  }

  if (operation.state === 'success') {
    loader.setResourceLoaded(resource);
    return;
  }

  loader.setResourceError({
    ...resource,
    error: {
      title: operation.title,
      actions: [
        { title: operation.retryTitle, callback: operation.retry },
        { title: operation.cancelTitle, callback: () => loader.clearScope(scopeKey) },
      ],
    },
  });
}
</script>

<template>
  <ViewLayout class="view-settings" align="center" justify="center" padding="none" overflow="auto">
    <WidgetSettingsPanel @operation="handleOperation" />
  </ViewLayout>
</template>

<style scoped>
.view-settings {
  position: relative;
  scrollbar-gutter: stable;
}
</style>
