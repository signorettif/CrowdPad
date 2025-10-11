export interface GameInput {
  username: string;
  input: string;
  timestamp: number;
}

export interface Config {
  aggregationInterval: number;
  cooldown: number;
}

export type AuthStatus =
  | 'not_authenticated'
  | 'authenticated'
  | 'authentication_error';
