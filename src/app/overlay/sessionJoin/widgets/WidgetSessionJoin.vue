<script setup lang="ts">
import { useGameModeConnectionOptions } from '@/app/features/gameMode/composables/useGameModeConnectionOptions';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import AppModal from '@/app/shared/components/interaction/overlay/AppModal.vue';
import AppButton from '@/app/shared/components/ui/button/AppButton.vue';
import AppSegmentedCard from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import { TYPE_CONNECTION } from '@/app/shared/constants/game/typeConnection.conts';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';

interface Props {
  modelValue: boolean;
  selectedConnection: tKeyTypeConnection | null;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  select: [connection: tKeyTypeConnection];
}>();

const modalLocale = useLocale((locale) => locale.views.menu.index.modals.joinSession);
const { connectionOptions } = useGameModeConnectionOptions();

function handleSelect(value: string) {
  if (!Object.values(TYPE_CONNECTION).includes(value as tKeyTypeConnection)) {
    return;
  }

  emit('select', value as tKeyTypeConnection);
}
</script>

<template>
  <AppModal
    :model-value="modelValue"
    :aria-label="modalLocale.title"
    max-width="124rem"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <AppTitle :text="modalLocale.title" tag="h2" font-size="xl" />
    </template>

    <AppSegmentedCard
      :model-value="selectedConnection ?? ''"
      :options="connectionOptions"
      size="middle"
      width="100%"
      max-width="100%"
      @update:model-value="handleSelect"
    />

    <template #footer>
      <AppButton :text="modalLocale.close" variant="secondary" width="100%" @click="emit('update:modelValue', false)" />
    </template>
  </AppModal>
</template>
