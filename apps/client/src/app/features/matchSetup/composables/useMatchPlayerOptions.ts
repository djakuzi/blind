import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import type { iGameModeOption } from '@/app/domain/game/models/GameModeOption.model';
import type { Locale } from '@/app/shared/types/locale';
import type { iAppSegmentedCardOption } from '@/app/shared/components/ui/control/AppSegmentedCard.vue';
import { useGameModeStore } from '@/app/stores/gameMode/gameMode.store';

export function useMatchPlayerOptions(
  mode: MaybeRefOrGetter<iGameMode>,
  selectedPlayerOptionKey: MaybeRefOrGetter<string>,
  localePlayers: MaybeRefOrGetter<Locale['game']['format']['players']>,
) {
  const gameModeStore = useGameModeStore();

  function resolvePlayerOption(key: string): iGameModeOption | null {
    if (!toValue(mode).keyOptions.includes(key)) {
      return null;
    }

    return gameModeStore.options?.[key] ?? null;
  }

  const resolvedPlayerOptions = computed(() =>
    toValue(mode)
      .keyOptions.map(resolvePlayerOption)
      .filter((option): option is iGameModeOption => option !== null),
  );

  const selectedPlayerOption = computed(
    () => resolvePlayerOption(toValue(selectedPlayerOptionKey)) ?? resolvedPlayerOptions.value[0] ?? null,
  );

  const playerOptions = computed<iAppSegmentedCardOption[]>(() =>
    resolvedPlayerOptions.value.map((option) => ({
      value: option.key,
      label: toValue(localePlayers)[option.key] ?? option.key,
      image: {
        light: option.icon.light,
        dark: option.icon.dark,
      },
    })),
  );

  return {
    resolvePlayerOption,
    resolvedPlayerOptions,
    selectedPlayerOption,
    playerOptions,
  };
}
