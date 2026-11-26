<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { mockLobbyService } from '@/app/features/lobby/services/MockLobby.service';
import type { tLobbyTarget } from '@/app/domain/game/type/lobby/lobby.types';
import { KEY_ROUTE } from '@/app/router/constants/route.const';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppButton from '@/app/shared/components/ui/button/AppButton.vue';
import AppInputSearch from '@/app/shared/components/ui/input/AppInputSearch.vue';
import { useConnectionTypeOptions } from '@/app/shared/composables/useConnectionTypeOptions';
import type { Locale } from '@/app/shared/types/locale';
import AppText from '@/app/shared/components/elements/typography/AppText.vue';
import AppTitle from '@/app/shared/components/elements/typography/AppTitle.vue';
import AppModal from '@/app/shared/components/interaction/overlay/AppModal.vue';
import AppSegmentedCard from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import WidgetSteps from '@/app/shared/components/widgets/steps/WidgetSteps.vue';
import type { iWidgetStepsActions } from '@/app/shared/components/widgets/steps/WidgetSteps.vue';
import { TYPE_CONNECTION } from '@/app/shared/constants/game/typeConnection.conts';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';

interface Props {
  modelValue: boolean;
  selectedConnection: tKeyTypeConnection | null;
  locale: {
    modal: Locale['views']['menu']['index']['modals']['joinSession'];
    join: string;
    connection: Locale['connectionTypes'];
  };
}

type tSessionJoinStep = 'connection' | 'lobby';

const STEPS = ['connection', 'lobby'] as const;

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  select: [connection: tKeyTypeConnection];
}>();

const { connectionOptions } = useConnectionTypeOptions(() => props.locale.connection);

const router = useRouter();
const currentStep = ref<string>('connection');
const code = ref('');
const targets = ref<tLobbyTarget[]>([]);
const selectedTarget = ref<tLobbyTarget | null>(null);
const isJoining = ref(false);
const stepTitle = computed(() => props.locale.modal.steps[currentStep.value as tSessionJoinStep].title);

const actions = computed<Record<tSessionJoinStep, iWidgetStepsActions>>(() => ({
  connection: {
    next: {
      optionsButton: {
        optionsText: { text: props.locale.modal.next },
        disabled: !props.selectedConnection,
      },
    },
  },
  lobby: {
    back: {
      optionsButton: {
        optionsText: { text: props.locale.modal.back },
      },
    },
    save: {
      optionsButton: {
        optionsText: { text: props.locale.join },
        disabled: isJoining.value || (props.selectedConnection === 'BLUETOOTH' ? !selectedTarget.value : !code.value.trim()),
      },
    },
  },
}));

function handleSelect(value: string) {
  if (!Object.values(TYPE_CONNECTION).includes(value as tKeyTypeConnection)) {
    return;
  }

  emit('select', value as tKeyTypeConnection);
}

async function handleNext(step: string) {
  if (step !== 'lobby' || props.selectedConnection !== 'BLUETOOTH') return;
  const result = await mockLobbyService.find({ connection: 'BLUETOOTH' });
  targets.value = result.status === 'success' ? result.value : [];
}

async function handleSave() {
  if (!props.selectedConnection || isJoining.value) return;
  isJoining.value = true;
  try {
    let target = selectedTarget.value;
    if (props.selectedConnection !== 'BLUETOOTH') {
      const result = await mockLobbyService.find({ connection: props.selectedConnection, code: code.value.trim() });
      target = result.status === 'success' ? (result.value[0] ?? null) : null;
    }
    if (!target) return;
    const result = await mockLobbyService.join(target);
    if (result.status === 'success') {
      emit('update:modelValue', false);
      await router.push({ name: KEY_ROUTE.lobby.index });
    }
  } finally {
    isJoining.value = false;
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      currentStep.value = 'connection';
      selectedTarget.value = null;
      targets.value = [];
      code.value = '';
    }
  },
);
</script>

<template>
  <AppModal
    :model-value="modelValue"
    :aria-label="stepTitle"
    :options-body="{ paddingX: 0, paddingY: 0 }"
    max-width="124rem"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <AppTitle :text="stepTitle" tag="h2" font-size="xl" />
    </template>

    <WidgetSteps v-model:step="currentStep" :steps="STEPS" :actions="actions" @save="handleSave" @next="handleNext">
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
        <AppFlex direction="column" :gap="4">
          <AppText :text="locale.modal.demo" tag="p" />
          <template v-if="selectedConnection === 'BLUETOOTH'">
            <AppButton
              v-for="target in targets"
              :key="target.connection === 'BLUETOOTH' ? target.deviceId : target.code"
              :options-text="{ text: locale.modal.demoDevice }"
              :variant="selectedTarget === target ? 'primary' : 'secondary'"
              @click="selectedTarget = target"
            />
          </template>
          <AppInputSearch v-else v-model="code" :placeholder="locale.modal.code" :aria-label="locale.modal.code" />
        </AppFlex>
      </template>
    </WidgetSteps>
  </AppModal>
</template>
