export type tGameModeWinCondition = 'single-hit' | 'health';

export type tOptionGameMode = {
    readonly players: number;
    readonly rounds: number;
    readonly winCondition: tGameModeWinCondition;
}