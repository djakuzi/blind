<script setup lang="ts">
import type { PropsWidth } from '@/app/shared/types/props/dimensions.props';
import type { PropsDisabled } from '@/app/shared/types/props/interaction.props';
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import { computed } from 'vue';
import AppCard from '@/app/shared/components/atoms/card/AppCard.vue';
import type { PropsAppCard } from '@/app/shared/components/atoms/card/AppCard.vue';
import AppBloodFill from '@/app/shared/components/effects/fill/AppBloodFill.vue';
import type { PropsAppBloodFill } from '@/app/shared/components/effects/fill/AppBloodFill.vue';
import AppHoldAction from '@/app/shared/components/interaction/hold/AppHoldAction.vue';
import type { PropsAppHoldAction } from '@/app/shared/components/interaction/hold/AppHoldAction.vue';

export interface PropsAppCardHold extends PropsWidth, PropsSizeVariant, PropsDisabled {
  optionsCard?: Omit<PropsAppCard, 'width' | 'maxWidth' | 'size'>;
  optionsHold?: Omit<PropsAppHoldAction, 'width' | 'maxWidth' | 'disabled'>;
  optionsBloodFill?: Omit<PropsAppBloodFill, 'isActive' | 'progressRatio'>;
}

const props = withDefaults(defineProps<PropsAppCardHold>(), {
  size: 'middle',
  width: '100%',
  maxWidth: '100%',
  disabled: false,
  optionsCard: undefined,
  optionsHold: undefined,
  optionsBloodFill: undefined,
});

const cardProps = computed<NonNullable<PropsAppCardHold['optionsCard']>>(() => ({
  ...props.optionsCard,
  overflow: props.optionsCard?.overflow ?? 'hidden',
}));

const holdProps = computed<NonNullable<PropsAppCardHold['optionsHold']>>(() => ({
  ...props.optionsHold,
  holdStartDelay: props.optionsHold?.holdStartDelay ?? 40,
}));

const bloodFillProps = computed<NonNullable<PropsAppCardHold['optionsBloodFill']>>(() => ({
  ...props.optionsBloodFill,
  waveHeight: props.optionsBloodFill?.waveHeight ?? 'clamp(3.5rem, 12%, 6rem)',
  waveLengthScale: props.optionsBloodFill?.waveLengthScale ?? 1.3,
}));

const emit = defineEmits<{
  complete: [];
}>();

function handleComplete() {
  emit('complete');
}
</script>

<template>
  <AppHoldAction
    v-bind="holdProps"
    :disabled="disabled"
    :width="width"
    :max-width="maxWidth"
    @complete="handleComplete"
  >
    <template #default="{ isProgressActive, isHolding, isComplete }">
      <AppCard
        v-bind="cardProps"
        class="app-card-hold"
        :class="{
          'app-card-hold--disabled': disabled,
          'app-card-hold--holding': isHolding,
          'app-card-hold--complete': isComplete,
        }"
        :size="size"
        width="100%"
        max-width="100%"
      >
        <AppBloodFill v-bind="bloodFillProps" :is-active="isProgressActive" />

        <div class="app-card-hold__content">
          <slot :is-holding="isHolding" :is-complete="isComplete" />
        </div>

        <slot name="overlay" :is-holding="isHolding" :is-complete="isComplete" />
      </AppCard>
    </template>
  </AppHoldAction>
</template>

<style scoped>
.app-card-hold {
  position: relative;
  cursor: var(--app-cursor-pointer);
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.app-card-hold__content {
  position: relative;
  z-index: 1;
  width: 100%;
  min-width: 0;
}

.app-card-hold--disabled {
  cursor: var(--app-cursor-disabled);
}
</style>
