export const suits = [
  'yellow',
  'blue',
  'white',
  'green',
  'red',
  'purple',
] as const;
export const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;

export type Suit = (typeof suits)[number];
export type Rank = (typeof ranks)[number];

export type ExpeditionCard = `${Suit}-${Rank}`;

export interface GameState {
  player1: [RoundState, RoundState, RoundState];
  player2: [RoundState, RoundState, RoundState];
}

export interface RoundState {
  expeditions: { [K in ExpeditionCard]?: true };
  wagers: { [K in Suit]?: 2 | 3 | 4 };
}
