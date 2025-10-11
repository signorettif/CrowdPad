import type { AuthStatus, GameInput, Config } from '../types';

export interface WebSocketState {
  chatMessages: GameInput[];
  onlineCount: number;
  authStatus: AuthStatus;
  config?: Config;
}

type WebSocketAction =
  | { type: 'SET_AUTH_STATUS'; payload: AuthStatus }
  | {
      type: 'SET_CONFIG';
      payload: Config;
    }
  | { type: 'ADD_MESSAGE'; payload: GameInput }
  | { type: 'SET_MESSAGES'; payload: GameInput[] }
  | { type: 'SET_USER_COUNT'; payload: number };

const webSocketReducer = (
  state: WebSocketState,
  action: WebSocketAction
): WebSocketState => {
  switch (action.type) {
    case 'SET_AUTH_STATUS':
      return { ...state, authStatus: action.payload };
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        chatMessages: [action.payload, ...state.chatMessages],
      };
    case 'SET_MESSAGES':
      return { ...state, chatMessages: action.payload };
    case 'SET_USER_COUNT':
      return { ...state, onlineCount: action.payload };
    default:
      return state;
  }
};

export default webSocketReducer;
