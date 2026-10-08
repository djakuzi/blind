import type { iApiGameModePlayerData } from '@/app/domain/game/type/api/common';
import type { Locale } from '@/app/shared/types/locale';
import { LibText } from '@/app/shared/lib/text';

export function formatGameModePlayers(option: iApiGameModePlayerData, languageCode: string, locale: Locale) {
  const { players, teamSize } = option;

  if (teamSize <= 0 || players <= 0 || players % teamSize !== 0) {
    return LibText.formatPluralCount(players, languageCode, locale.game.format.players);
  }

  const teamCount = players / teamSize;

  if (teamCount < 2) {
    return LibText.formatPluralCount(players, languageCode, locale.game.format.players);
  }

  return Array.from({ length: teamCount }, () => teamSize).join(' VS ');
}

export function formatGameModeRounds(rounds: number, languageCode: string, locale: Locale) {
  return LibText.formatPluralCount(rounds, languageCode, locale.game.format.rounds);
}
