<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useGameModeConnectionOptions } from '@/app/features/gameMode/composables/useGameModeConnectionOptions';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import AppModal from '@/app/shared/components/interaction/overlay/AppModal.vue';
import AppSegmentedCard from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import WidgetSteps from '@/app/shared/components/widgets/steps/WidgetSteps.vue';
import type { iWidgetStepsActions } from '@/app/shared/components/widgets/steps/WidgetSteps.vue';
import { TYPE_CONNECTION } from '@/app/shared/constants/game/typeConnection.conts';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';

interface Props {
  modelValue: boolean;
  selectedConnection: tKeyTypeConnection | null;
}

type tSessionJoinStep = 'connection' | 'lobby';

const STEPS = ['connection', 'lobby'] as const;

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  select: [connection: tKeyTypeConnection];
}>();

const modalLocale = useLocale((locale) => locale.views.menu.index.modals.joinSession);
const joinText = useLocale((locale) => locale.views.menu.index.ui.join);
const { connectionOptions } = useGameModeConnectionOptions();

const currentStep = ref<string>('connection');
const selectedTargetKey = ref<string | null>(null);
const stepTitle = computed(() => modalLocale.value.steps[currentStep.value as tSessionJoinStep].title);

const actions = computed<Record<tSessionJoinStep, iWidgetStepsActions>>(() => ({
  connection: {
    next: {
      text: modalLocale.value.next,
      disabled: !props.selectedConnection,
    },
  },
  lobby: {
    back: {
      text: modalLocale.value.back,
    },
    save: {
      text: joinText.value,
      disabled: !selectedTargetKey.value,
    },
  },
}));

function handleSelect(value: string) {
  if (!Object.values(TYPE_CONNECTION).includes(value as tKeyTypeConnection)) {
    return;
  }

  emit('select', value as tKeyTypeConnection);
}

function handleSave(_step: string) {
  // Lobby connection will be implemented here.
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      currentStep.value = 'connection';
      selectedTargetKey.value = null;
    }
  },
);
</script>

<template>
  <AppModal
    :model-value="modelValue"
    :aria-label="stepTitle"
    :body-padding-x="0"
    :body-padding-y="0"
    max-width="124rem"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <AppTitle :text="stepTitle" tag="h2" font-size="xl" />
    </template>

    <WidgetSteps v-model:step="currentStep" :steps="STEPS" :actions="actions" @save="handleSave">
      <template #connection>
        <AppSegmentedCard
          :model-value="selectedConnection ?? ''"
          :options="connectionOptions"
          size="big"
          width="100%"
          max-width="100%"
          @update:model-value="handleSelect"
        />
      </template>

      <template #lobby>
        <AppText class="widget-session-join__placeholder" :text="modalLocale.steps.lobby.placeholder" tag="p" />
      </template>
    </WidgetSteps>
  </AppModal>
</template>

<style scoped>
.widget-session-join__placeholder {
  text-align: center;
}
</style>
