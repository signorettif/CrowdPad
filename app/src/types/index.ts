export interface GameInput {
  username: string;
  input: string;
  timestamp: number;
}

export interface ServerMessage {
  type: 'auth_status' | 'input' | 'messages' | 'user_count';
  data: any;
}
