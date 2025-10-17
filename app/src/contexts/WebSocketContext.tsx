import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  type ReactNode,
  useCallback,
  useRef,
} from 'react';

import webSocketReducer from '../reducers/webSocketReducer';

import { WebSocketService } from '../utils/webSocket';

import type { ServerMessage } from '../types/serverMessages';
import type { WebSocketState } from '../reducers/webSocketReducer';

const initialState: WebSocketState = {
  chatMessages: [],
  onlineCount: 0,
  authStatus: 'not_authenticated',
  config: undefined,
};

interface WebSocketContextType extends WebSocketState {
  send: (data: object) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(webSocketReducer, initialState);

  const wsServiceRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    const ws = new WebSocketService();
    wsServiceRef.current = ws;

    ws.onOpen(() => {
      ws.send({ type: 'join' });
    });

    ws.onMessage((message: ServerMessage) => {
      switch (message.type) {
        case 'auth_status':
          if (message.data.authenticated) {
            dispatch({ type: 'SET_AUTH_STATUS', payload: 'authenticated' });
            if (message.data.config) {
              dispatch({ type: 'SET_CONFIG', payload: message.data.config });
            }
          } else {
            dispatch({
              type: 'SET_AUTH_STATUS',
              payload: 'authentication_error',
            });
          }
          break;
        case 'input':
          dispatch({ type: 'ADD_MESSAGE', payload: message.data });
          break;
        case 'messages':
          dispatch({ type: 'SET_MESSAGES', payload: message.data });
          break;
        case 'user_count':
          dispatch({ type: 'SET_USER_COUNT', payload: message.data.count });
          break;
        case 'move_executed': {
          const { command, votes, timestamp } = message.data;
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              username: 'system',
              input: `🎮 executed ${command} with ${votes} votes`,
              timestamp,
            },
          });
          break;
        }
        case 'config_update':
          if (message.data && message.data.config) {
            dispatch({ type: 'SET_CONFIG', payload: message.data.config });
          }
          break;
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = useCallback(
    (data: object) => {
      wsServiceRef.current?.send(data);
    },
    [wsServiceRef.current]
  );

  const contextValue = useMemo(() => {
    return { ...state, send: sendMessage };
  }, [state, sendMessage]);

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
