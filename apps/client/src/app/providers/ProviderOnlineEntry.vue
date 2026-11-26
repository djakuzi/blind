<script setup lang="ts">
import { useLocale } from '@/app/features/locale/composables/useLocale';
import { useOnlineEntryOverlay } from '@/app/features/lobby/composables/useOnlineEntryOverlay';
import WidgetOnlineEntry from '@/app/features/lobby/widgets/WidgetOnlineEntry.vue';

const locale = useLocale((value) => value.views.menu.index.modals.onlineEntry);
const { isOpen, close } = useOnlineEntryOverlay();

function handleOpenChange(value: boolean) {
  if (!value) close();
}
</script>

<template>
  <WidgetOnlineEntry :locale="locale" :model-value="isOpen" @update:model-value="handleOpenChange" />
</template>
