<script lang="ts">
import type { PropsAppButton } from '@/app/shared/components/ui/button/AppButton.vue';
import type { tPaddingValue } from '@/app/shared/styles/contracts/padding.contract';
import type { tSpaceValue } from '@/app/shared/styles/contracts/space.contract';

export type tWidgetStepsAction = 'back' | 'next' | 'save';

export interface iWidgetStepsButton extends PropsAppButton {
  visible?: boolean;
}

export type iWidgetStepsActions = Partial<Record<tWidgetStepsAction, iWidgetStepsButton>>;

export interface PropsWidgetSteps {
  steps: readonly string[];
  actions?: Readonly<Record<string, iWidgetStepsActions>>;
  buttonOrder?: readonly tWidgetStepsAction[];
  buttonProps?: Partial<Omit<PropsAppButton, 'text'>>;
  buttonGap?: tSpaceValue;
  contentPaddingX?: tPaddingValue;
  contentPaddingY?: tPaddingValue;
  actionsPaddingX?: tPaddingValue;
  actionsPaddingY?: tPaddingValue;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppButton from '@/app/shared/components/ui/button/AppButton.vue';
import { resolvePaddingValue } from '@/app/shared/styles/contracts/padding.contract';

const props = withDefaults(defineProps<PropsWidgetSteps>(), {
  actions: (): Record<string, iWidgetStepsActions> => ({}),
  buttonOrder: (): tWidgetStepsAction[] => ['back', 'next', 'save'],
  buttonGap: 3,
  contentPaddingX: 6,
  contentPaddingY: 5,
  actionsPaddingX: 6,
  actionsPaddingY: 5,
});

const currentStepModel = defineModel<string>('step', { default: '' });

const emit = defineEmits<{
  next: [step: string];
  back: [step: string];
  save: [step: string];
}>();

const currentStep = computed(() => (props.steps.includes(currentStepModel.value) ? currentStepModel.value : (props.steps[0] ?? '')));
const stepIndex = computed(() => props.steps.indexOf(currentStep.value));

const visibleButtons = computed(() =>
  props.buttonOrder.flatMap((action) => {
    const config = props.actions[currentStep.value]?.[action];

    if (!config) {
      return [];
    }

    const { visible = true, ...actionProps } = config;

    if (!visible || (action === 'back' && stepIndex.value <= 0) || (action === 'next' && stepIndex.value >= props.steps.length - 1)) {
      return [];
    }

    const buttonProps: PropsAppButton = {
      variant: action === 'back' ? 'secondary' : 'primary',
      size: 'middle',
      width: 'auto',
      ...props.buttonProps,
      ...actionProps,
    };

    return [{ action, props: buttonProps }];
  }),
);

const stepsStyle = computed(() => ({
  '--cp-steps-content-padding-x': resolvePaddingValue(props.contentPaddingX),
  '--cp-steps-content-padding-y': resolvePaddingValue(props.contentPaddingY),
  '--cp-steps-actions-padding-x': resolvePaddingValue(props.actionsPaddingX),
  '--cp-steps-actions-padding-y': resolvePaddingValue(props.actionsPaddingY),
}));

function handleAction(action: tWidgetStepsAction) {
  const button = visibleButtons.value.find((item) => item.action === action);

  if (!button || button.props.disabled || !currentStep.value) {
    return;
  }

  if (action === 'save') {
    emit('save', currentStep.value);
    return;
  }

  const nextIndex = stepIndex.value + (action === 'next' ? 1 : -1);
  const targetStep = props.steps[nextIndex];

  if (!targetStep) {
    return;
  }

  currentStepModel.value = targetStep;

  if (action === 'back') {
    emit('back', targetStep);
  } else {
    emit('next', targetStep);
  }
}
</script>

<template>
  <div class="widget-steps" :style="stepsStyle">
    <div class="widget-steps__content">
      <slot :name="currentStep" :step="currentStep">
        <slot :step="currentStep" />
      </slot>
    </div>

    <AppFlex
      v-if="visibleButtons.length"
      class="widget-steps__actions"
      align="center"
      justify="center"
      wrap="wrap"
      width="100%"
      :gap="buttonGap"
    >
      <slot name="actions" :step="currentStep" :buttons="visibleButtons" :handle-action="handleAction">
        <AppButton v-for="button in visibleButtons" :key="button.action" v-bind="button.props" @click="handleAction(button.action)" />
      </slot>
    </AppFlex>
  </div>
</template>

<style scoped>
.widget-steps {
  width: 100%;
  min-width: 0;
}

.widget-steps__content {
  min-width: 0;
  padding: var(--cp-steps-content-padding-y) var(--cp-steps-content-padding-x);
}

.widget-steps__actions {
  min-width: 0;
  box-sizing: border-box;
  padding: var(--cp-steps-actions-padding-y) var(--cp-steps-actions-padding-x);
}

.widget-steps__actions > * {
  flex: 0 0 auto;
  min-width: 0;
  max-width: 100%;
}
</style>
