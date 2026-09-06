import { LibText } from '@/app/shared/lib/text';

import type {
  DataGameMode,
  tKeyGameMode,
} from '../constants/gameMode.const';

const PLAYER_PLURAL_FORMS = {
  one: 'игрок',
  few: 'игрока',
  many: 'игроков',
} as const;

const ROUND_PLURAL_FORMS = {
  one: 'раунд',
  few: 'раунда',
  many: 'раундов',
} as const;

export interface iPayloadModelGameMode
  extends DataGameMode {
  key: tKeyGameMode
}

export class ModelGameMode {
  readonly key: tKeyGameMode;
  readonly title: DataGameMode['title'];
  readonly description: DataGameMode['description'];
  readonly img: DataGameMode['img'];
  readonly options: DataGameMode['options'];
  readonly typeConnection: DataGameMode['typeConnection'];

  constructor(
    payload: iPayloadModelGameMode,
  ) {
    this.key = payload.key;
    this.title = payload.title;
    this.description = payload.description;
    this.img = payload.img;
    this.options = payload.options;
    this.typeConnection = payload.typeConnection;
  }

  getPlayersDescription(): string {
    const {
      players,
      teamSize,
    } = this.options;

    if (
      teamSize === undefined
      || teamSize <= 0
      || players <= 0
      || players % teamSize !== 0
    ) {
      return LibText.formatPluralCount(
        players,
        PLAYER_PLURAL_FORMS,
      );
    }

    const teamCount =
      players / teamSize;

    if (teamCount < 2) {
      return LibText.formatPluralCount(
        players,
        PLAYER_PLURAL_FORMS,
      );
    }

    return Array
      .from(
        {
          length: teamCount,
        },
        () => teamSize,
      )
      .join(' VS ');
  }

  getRoundsDescription(): string {
    return LibText.formatPluralCount(
      this.options.rounds,
      ROUND_PLURAL_FORMS,
    );
  }
}