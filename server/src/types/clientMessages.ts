export interface JoinMessage {
  type: 'join';
  data: {
    username: string;
  };
}

export interface AuthMessage {
  type: 'auth';
  data: {
    secretKey: string;
    aggregationInterval?: number;
  };
}

export interface InputMessage {
  type: 'input';
  data: {
    username: string;
    input: string;
  };
}

export interface GetMessagesMessage {
  type: 'get_messages';
}

export interface MoveExecutedClientMessage {
  type: 'move_executed';
  data: {
    command: string;
    votes: number;
    timestamp: number;
  };
}

export type ClientMessage =
  | JoinMessage
  | AuthMessage
  | InputMessage
  | GetMessagesMessage
  | MoveExecutedClientMessage;