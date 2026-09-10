import type { InjectionKey, Ref } from 'vue';

export interface iFillContext {
    rootElement: Ref<HTMLElement | null>
    progressRatio: Readonly<Ref<number>>
    isActive: Readonly<Ref<boolean>>
}

export const FILL_CONTEXT = Symbol('fill-context') as InjectionKey<iFillContext>;