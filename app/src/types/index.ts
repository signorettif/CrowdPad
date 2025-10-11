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

export type UpdateConfigStatus =
  | 'not_started'
  | 'updating'
  | 'updated'
  | 'update_error';
