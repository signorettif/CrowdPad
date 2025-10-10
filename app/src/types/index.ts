export interface GameInput {
  username: string;
  input: string;
  timestamp: number;
}

export type AuthStatus =
  | 'not_authenticated'
  | 'authenticated'
  | 'authentication_error';
