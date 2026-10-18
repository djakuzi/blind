import type { iGameSessionData, iGameSessionPlayer, tGameSessionStatus } from '../type/session/session';
import type { iGameSessionConfig } from '../type/session/config';

export class ModelGameSession implements iGameSessionData {
  readonly id: string;
  readonly ownerId: string | null;
  readonly config: iGameSessionConfig;
  readonly status: tGameSessionStatus;
  readonly players: readonly iGameSessionPlayer[];

  constructor(payload: iGameSessionData) {
    const { config, players } = payload;

    if (!payload.id.trim()) {
      throw new Error('Game session ID is required');
    }

    if (
      !Number.isInteger(config.players) ||
      !Number.isInteger(config.teamSize) ||
      !Number.isInteger(config.rounds) ||
      config.players <= 0 ||
      config.teamSize <= 0 ||
      config.rounds <= 0 ||
      config.players !== config.teamSize * 2
    ) {
      throw new Error('Invalid game session configuration');
    }

    if (players.length > config.players) {
      throw new Error('Game session has too many players');
    }

    const playerIds = new Set<string>();
    const teamCounts = { 0: 0, 1: 0 };

    for (const player of players) {
      if (!player.id.trim() || playerIds.has(player.id)) {
        throw new Error('Game session player IDs must be unique and non-empty');
      }

      playerIds.add(player.id);
      teamCounts[player.team] += 1;

      if (teamCounts[player.team] > config.teamSize) {
        throw new Error('Game session team capacity exceeded');
      }
    }

    this.id = payload.id;
    this.ownerId = payload.ownerId;
    this.config = { ...config };
    this.status = payload.status;
    this.players = players.map((player) => ({ ...player }));
  }

  get isFull(): boolean {
    return this.players.length === this.config.players;
  }

  get canStart(): boolean {
    return (
      this.status === 'lobby' &&
      this.isFull &&
      this.players.every((player) => player.isReady && Boolean(player.characterId?.trim())) &&
      this.players.filter((player) => player.team === 0).length === this.config.teamSize &&
      this.players.filter((player) => player.team === 1).length === this.config.teamSize
    );
  }
}
