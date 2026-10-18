<script setup lang="ts">
import { computed, watch } from 'vue';
import { useGameModeConnectionOptions } from '@/app/features/gameMode/composables/useGameModeConnectionOptions';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import AppModal from '@/app/shared/components/interaction/overlay/AppModal.vue';
import { useInteractionSteps } from '@/app/shared/components/interaction/steps/useInteractionSteps';
import AppButton from '@/app/shared/components/ui/button/AppButton.vue';
import AppSegmentedCard from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import { TYPE_CONNECTION } from '@/app/shared/constants/game/typeConnection.conts';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';

interface Props {
  modelValue: boolean;
  selectedConnection: tKeyTypeConnection | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  select: [connection: tKeyTypeConnection];
}>();

const modalLocale = useLocale((locale) => locale.views.menu.index.modals.joinSession);
const { connectionOptions } = useGameModeConnectionOptions();
const { currentStep, next, back, reset } = useInteractionSteps(['connection', 'gameMode'] as const);

const stepTitle = computed(() => modalLocale.value.steps[currentStep.value].title);

function handleSelect(value: string) {
  if (!Object.values(TYPE_CONNECTION).includes(value as tKeyTypeConnection)) {
    return;
  }

  emit('select', value as tKeyTypeConnection);
}

function handleNext() {
  if (currentStep.value !== 'connection' || !props.selectedConnection) {
    return;
  }

  next();
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      reset();
    }
  },
);
</script>

<template>
  <AppModal
    :model-value="modelValue"
    :aria-label="stepTitle"
    max-width="124rem"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <AppTitle :text="stepTitle" tag="h2" font-size="xl" />
    </template>

    <AppSegmentedCard
      v-if="currentStep === 'connection'"
      :model-value="selectedConnection ?? ''"
      :options="connectionOptions"
      size="middle"
      width="100%"
      max-width="100%"
      @update:model-value="handleSelect"
    />

    <AppText v-else class="widget-session-join__placeholder" :text="modalLocale.steps.gameMode.placeholder" tag="p" />

    <template #footer>
      <AppButton
        v-if="currentStep === 'connection'"
        :text="modalLocale.next"
        :disabled="!selectedConnection"
        width="100%"
        @click="handleNext"
      />
      <AppButton v-else :text="modalLocale.back" variant="secondary" width="100%" @click="back" />
    </template>
  </AppModal>
</template>

<style scoped>
.widget-session-join__placeholder {
  text-align: center;
}
</style>
