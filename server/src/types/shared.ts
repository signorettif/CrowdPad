/**
 * Shared types between client and server
 */

export interface GameInput {
  username: string;
  input: string;
  timestamp: number;
}

export const GAME_INPUTS = [
  'up',
  'down',
  'left',
  'right',
  'a',
  'b',
  'start',
  'select',
] as const;

export type GameInputType = (typeof GAME_INPUTS)[number];
