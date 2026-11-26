<script setup lang="ts">
import { useLocale } from '@/app/features/locale/composables/useLocale';
import { useSessionJoinOverlay } from '@/app/features/lobby/composables/useSessionJoinOverlay';
import WidgetSessionJoin from '@/app/features/lobby/widgets/WidgetSessionJoin.vue';

const locale = useLocale((value) => ({
  modal: value.views.menu.index.modals.joinSession,
  join: value.views.menu.index.ui.join,
  connection: value.connectionTypes,
}));

const { isOpen, selectedConnection, close, select } = useSessionJoinOverlay();

function handleOpenChange(value: boolean) {
  if (!value) {
    close();
  }
}
</script>

<template>
  <WidgetSessionJoin
    :locale="locale"
    :model-value="isOpen"
    :selected-connection="selectedConnection"
    @update:model-value="handleOpenChange"
    @select="select"
  />
</template>
