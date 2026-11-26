<script setup lang="ts">
import { useCreateLobby } from '@/app/features/lobby/composables/useCreateLobby';
import { usePreGameStore } from '@/app/stores/preGame/preGame.store';
import type { Locale } from '@/app/shared/types/locale';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppText from '@/app/shared/components/elements/typography/AppText.vue';
import AppTitle from '@/app/shared/components/elements/typography/AppTitle.vue';
import AppModal from '@/app/shared/components/interaction/overlay/AppModal.vue';
import AppButton from '@/app/shared/components/ui/button/AppButton.vue';

interface Props {
  modelValue: boolean;
  locale: Locale['views']['menu']['index']['modals']['onlineEntry'];
}

defineProps<Props>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
const { createLobby } = useCreateLobby();
const preGameStore = usePreGameStore();

async function handleCreate(entry: 'create' | 'quickMatch' = 'create') {
  const { mode, players, connection } = preGameStore;

  if (!mode || !players || !connection) return;
  const result = await createLobby({ mode, players, connection }, entry);
  if (result.status === 'success') emit('update:modelValue', false);
}
</script>

<template>
  <AppModal :model-value="modelValue" :aria-label="locale.title" @update:model-value="emit('update:modelValue', $event)">
    <template #header><AppTitle :text="locale.title" tag="h2" font-size="xl" /></template>
    <AppFlex direction="column" :gap="4">
      <AppText :text="locale.demo" />
      <AppButton :options-text="{ text: locale.create }" @click="handleCreate()" />
      <AppButton :options-text="{ text: locale.quickMatch }" @click="handleCreate('quickMatch')" />
    </AppFlex>
  </AppModal>
</template>
