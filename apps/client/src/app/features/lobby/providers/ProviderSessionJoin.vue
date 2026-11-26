<script setup lang="ts">
import { useSessionJoinOverlay } from '@/app/features/lobby/composables/useSessionJoinOverlay';
import WidgetSessionJoin from '@/app/features/lobby/widgets/WidgetSessionJoin.vue';

const { isOpen, selectedConnection, close, select } = useSessionJoinOverlay();

function handleOpenChange(value: boolean) {
  if (!value) {
    close();
  }
}
</script>

<template>
  <WidgetSessionJoin
    :model-value="isOpen"
    :selected-connection="selectedConnection"
    @update:model-value="handleOpenChange"
    @select="select"
  />
</template>
