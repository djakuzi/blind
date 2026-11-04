<script setup lang="ts">
import type { PropsWidth } from '@/app/shared/types/props/dimensions.props';
import type { PropsDisabled } from '@/app/shared/types/props/interaction.props';
import type { PropsSizeVariant } from '@/app/shared/types/props/size.props';
import { computed } from 'vue';
import AppBloodFill from '@/app/shared/components/effects/fill/AppBloodFill.vue';
import type { PropsAppBloodFill } from '@/app/shared/components/effects/fill/AppBloodFill.vue';
import AppFillAware from '@/app/shared/components/effects/fill/AppFillAware.vue';
import AppHoldAction from '@/app/shared/components/interaction/hold/AppHoldAction.vue';
import type { PropsAppHoldAction } from '@/app/shared/components/interaction/hold/AppHoldAction.vue';
import { LibStyle } from '@/core/lib/style';

type tAppButtonHoldVariant = 'primary';

type tAppButtonHoldOptions = Omit<PropsAppHoldAction, 'width' | 'maxWidth' | 'disabled' | 'moveCancelThreshold'>;

interface Props extends PropsWidth, PropsDisabled, PropsSizeVariant {
  variant?: tAppButtonHoldVariant;
  text?: string;
  optionsHold?: tAppButtonHoldOptions;
  optionsBloodFill?: Omit<PropsAppBloodFill, 'isActive' | 'progressRatio'>;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'middle',
  maxWidth: '100%',
  width: '100%',
  variant: 'primary',
  text: undefined,
  optionsHold: undefined,
  optionsBloodFill: undefined,
});

const emit = defineEmits<{
  complete: [];
}>();

const buttonClass = computed(() => ['app-button-hold', `app-button-hold--${props.variant}`, `app-button-hold--size-${props.size}`]);

const holdProps = computed<tAppButtonHoldOptions>(() => ({
  ...props.optionsHold,
  duration: props.optionsHold?.duration ?? 450,
}));

const bloodFillProps = computed<NonNullable<Props['optionsBloodFill']>>(() => ({
  ...props.optionsBloodFill,
  flowFrontDuration: props.optionsBloodFill?.flowFrontDuration ?? 1200,
}));

const holdActionWidth = computed(() => LibStyle.toSizeValue(props.width));
const holdActionMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));

function handleComplete() {
  emit('complete');
}
</script>

<template>
  <AppHoldAction
    v-bind="holdProps"
    :disabled="disabled"
    :max-width="holdActionMaxWidth"
    :width="holdActionWidth"
    @complete="handleComplete"
  >
    <template #default="{ isProgressActive }">
      <button :class="buttonClass" :disabled="disabled" type="button">
        <AppBloodFill v-bind="bloodFillProps" :is-active="isProgressActive" />

        <AppFillAware class="app-button-hold__content" tag="span" color="inherit" filled-color="on-primary">
          <slot>{{ text }}</slot>
        </AppFillAware>
      </button>
    </template>
  </AppHoldAction>
</template>

<style scoped>
.app-button-hold {
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border: var(--app-border-width-medium) var(--app-border-style-solid) var(--app-color-text-primary);
  border-radius: var(--app-radius-md);
  background: var(--app-color-surface-primary);
  color: var(--app-color-text-primary);
  line-height: var(--app-line-height-control);
  letter-spacing: var(--app-letter-spacing-wider);
  text-align: center;
  text-transform: uppercase;
  overflow: hidden;
  cursor: var(--app-cursor-pointer);
  user-select: none;
  touch-action: none;
  appearance: none;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .app-button-hold:not(:disabled):hover {
    background: color-mix(in srgb, var(--app-color-surface-primary) 94%, var(--app-color-primary));
    border-color: var(--app-color-primary);
    box-shadow: 0 0 0 var(--app-border-width-medium) color-mix(in srgb, var(--app-color-primary) 16%, transparent);
  }
}

.app-button-hold:disabled {
  color: var(--app-color-text-disabled);
  cursor: var(--app-cursor-disabled);
}

.app-button-hold__content {
  position: relative;
  z-index: 1;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-button-hold--size-small {
  padding: var(--app-space-3) var(--app-space-8);
  font-size: var(--app-font-size-xl);
}

.app-button-hold--size-middle {
  padding: var(--app-space-4) var(--app-space-10);
  font-size: var(--app-font-size-2xl);
}

.app-button-hold--size-big {
  padding: var(--app-space-5) var(--app-space-12);
  font-size: var(--app-font-size-3xl);
}
</style>
