import { computed, inject, onScopeDispose, provide, shallowRef, toValue, watch } from 'vue';
import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from 'vue';
import type { PropsAppButton } from '@/app/shared/components/ui/button/AppButton.vue';

export interface iHeaderAction {
  key: string;
  text: string;
  optionsButton?: Partial<Omit<PropsAppButton, 'text'>>;
  onClick: () => void;
}

interface iHeaderActionsContext {
  actions: ComputedRef<readonly iHeaderAction[]>;
  setActions: (owner: symbol, actions: readonly iHeaderAction[]) => void;
  clearActions: (owner: symbol) => void;
}

const HEADER_ACTIONS_CONTEXT = Symbol('header-actions') as InjectionKey<iHeaderActionsContext>;

export function provideHeaderActions() {
  const actions = shallowRef<readonly iHeaderAction[]>([]);
  let currentOwner: symbol | null = null;

  provide(HEADER_ACTIONS_CONTEXT, {
    actions: computed(() => actions.value),
    setActions(owner, value) {
      currentOwner = owner;
      actions.value = value;
    },
    clearActions(owner) {
      if (currentOwner !== owner) {
        return;
      }

      currentOwner = null;
      actions.value = [];
    },
  });
}

export function useHeaderActions(source?: MaybeRefOrGetter<readonly iHeaderAction[]>) {
  const context = inject(HEADER_ACTIONS_CONTEXT);

  if (!context) {
    throw new Error('useHeaderActions must be used inside LayoutBase');
  }

  if (source !== undefined) {
    const owner = Symbol('header-actions');

    watch(() => toValue(source), (actions) => context.setActions(owner, actions), { immediate: true });

    onScopeDispose(() => context.clearActions(owner));
  }

  return {
    actions: context.actions,
  };
}
