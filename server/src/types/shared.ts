/**
 * Shared types between client and server
 */

export interface GameInput {
  username: string;
  input: string;
  timestamp: number;
}

export interface ClientMessage {
  type: 'input' | 'get_messages' | 'join' | 'auth' | 'move_executed';
  data?: {
    username?: string;
    input?: string;
    secretKey?: string;
    chosenCommand?: string;
    voteCounts?: Record<string, number>;
    windowStart?: number;
    windowEnd?: number;
    timestamp?: number;
  };
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
