/**
 * Shared types between client and server
 */

export interface GameInput {
  username: string;
  input: string;
  timestamp: number;
}

export interface ClientMessage {
  type: 'input' | 'get_messages' | 'join' | 'auth';
  data?: {
    username?: string;
    input?: string;
    secretKey?: string;
  };
}

export interface ServerMessage {
  type: 'input' | 'messages' | 'user_count' | 'auth_status';
  data: any;
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
