export interface GameInput {
  username: string;
  input: string;
  timestamp: number;
}

export interface ServerMessage {
  type: 'auth_status' | 'input' | 'messages' | 'user_count' | 'move_executed';
  data: any;
}

export type AuthStatus =
  | 'not_authenticated'
  | 'authenticated'
  | 'authentication_error';
