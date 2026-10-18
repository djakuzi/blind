import { computed, ref } from 'vue';

export function useInteractionSteps<TStep extends string>(steps: readonly [TStep, ...TStep[]]) {
  const stepIndex = ref(0);

  const currentStep = computed<TStep>(() => steps[stepIndex.value] ?? steps[0]);
  const canGoNext = computed(() => stepIndex.value < steps.length - 1);
  const canGoBack = computed(() => stepIndex.value > 0);

  function next() {
    if (canGoNext.value) {
      stepIndex.value += 1;
    }
  }

  function back() {
    if (canGoBack.value) {
      stepIndex.value -= 1;
    }
  }

  function reset() {
    stepIndex.value = 0;
  }

  return {
    currentStep,
    canGoNext,
    canGoBack,
    next,
    back,
    reset,
  };
}
