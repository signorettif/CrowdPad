import type { GameInput } from '.';

export interface AuthStatusMessage {
  type: 'auth_status';
  data: {
    authenticated: boolean;
    aggregationInterval?: number;
  };
}

export interface InputMessage {
  type: 'input';
  data: {
    username: string;
    input: string;
    timestamp: number;
  };
}

export interface MessagesMessage {
  type: 'messages';
  data: GameInput[];
}

export interface UserCountMessage {
  type: 'user_count';
  data: {
    count: number;
  };
}

export interface MoveExecutedMessage {
  type: 'move_executed';
  data: {
    chosenCommand?: string;
    voteCounts?: Record<string, number>;
    windowStart?: number;
    windowEnd?: number;
    timestamp?: number;
  };
}

export type ServerMessage =
  | AuthStatusMessage
  | InputMessage
  | MessagesMessage
  | UserCountMessage
  | MoveExecutedMessage;
