import type { iGameMode } from '@/app/domain/game/models/GameMode.model';
import type { Locale } from '@/app/shared/types/locale';
import { LibText } from '@/app/shared/lib/text';

export function formatGameModePlayers(mode: iGameMode, languageCode: string, locale: Locale) {
  const { players, teamSize } = mode.options;

  if (teamSize === undefined || teamSize <= 0 || players <= 0 || players % teamSize !== 0) {
    return LibText.formatPluralCount(players, languageCode, locale.game.format.players);
  }

  const teamCount = players / teamSize;

  if (teamCount < 2) {
    return LibText.formatPluralCount(players, languageCode, locale.game.format.players);
  }

  return Array.from(
    {
      length: teamCount,
    },
    () => teamSize,
  ).join(' VS ');
}

export function formatGameModeRounds(mode: iGameMode, languageCode: string, locale: Locale) {
  return LibText.formatPluralCount(mode.options.rounds, languageCode, locale.game.format.rounds);
}
