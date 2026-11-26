<script setup lang="ts">
import { computed } from 'vue';
import { useCreateLobby } from '@/app/features/lobby/composables/useCreateLobby';
import { usePreGameStore } from '@/app/stores/preGame/preGame.store';
import type { Locale } from '@/app/shared/types/locale';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppText from '@/app/shared/components/elements/typography/AppText.vue';
import AppTitle from '@/app/shared/components/elements/typography/AppTitle.vue';
import AppModal from '@/app/shared/components/interaction/overlay/AppModal.vue';
import AppSegmentedCard from '@/app/shared/components/ui/control/AppSegmentedCard.vue';

interface Props {
  modelValue: boolean;
  locale: Locale['views']['menu']['index']['modals']['onlineEntry'];
}

const props = defineProps<Props>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
const { createLobby } = useCreateLobby();
const preGameStore = usePreGameStore();
const options = computed(() => [
  { value: 'create', label: props.locale.create },
  { value: 'quickMatch', label: props.locale.quickMatch },
]);

function handleSelect(value: string) {
  if (value === 'create' || value === 'quickMatch') {
    void handleCreate(value);
  }
}

async function handleCreate(entry: 'create' | 'quickMatch' = 'create') {
  const { mode, players, connection } = preGameStore;

  if (!mode || !players || !connection) return;
  const result = await createLobby({ mode, players, connection }, entry);
  if (result.status === 'success') emit('update:modelValue', false);
}
</script>

<template>
  <AppModal :model-value="modelValue" :aria-label="locale.title" @update:model-value="emit('update:modelValue', $event)" max-width="60rem">
    <template #header><AppTitle :text="locale.title" tag="h2" font-size="xl" /></template>
    <AppFlex direction="column" :gap="4">
      <AppText :text="locale.demo" />
      <AppSegmentedCard model-value="" :options="options" direction="column" width="100%" @update:model-value="handleSelect" />
    </AppFlex>
  </AppModal>
</template>
