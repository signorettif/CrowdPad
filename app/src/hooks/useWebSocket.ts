import { useState, useEffect, useRef } from 'react';
import { getSocketUri } from '../utils/socket';

import type { GameInput, AuthStatus } from '../types';
import type {
  MoveExecutedMessage,
  ServerMessage,
} from '../types/serverMessages';

// --- WebSocket Service (simplified from server/src/utils/websockets/service.ts) ---
class WebSocketService {
  private ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);
  }

  onOpen(callback: () => void) {
    this.ws.onopen = callback;
  }

  onMessage(callback: (message: ServerMessage) => void) {
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        callback(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  send(data: object) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  close() {
    this.ws.close();
  }
}

export const useWebSocket = () => {
  const [chatMessages, setChatMessages] = useState<GameInput[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [lastMoveExecuted, setLastMoveExecuted] = useState<
    MoveExecutedMessage['data'] | null
  >(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('not_authenticated');
  const [aggregationInterval, setAggregationInterval] = useState<
    number | undefined
  >();
  const wsServiceRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    const ws = new WebSocketService(getSocketUri());
    wsServiceRef.current = ws;

    ws.onOpen(() => {
      ws.send({ type: 'join' });
    });

    ws.onMessage((message: ServerMessage) => {
      switch (message.type) {
        case 'auth_status':
          if (message.data.authenticated) {
            setAuthStatus('authenticated');
            if (message.data.aggregationInterval)
              setAggregationInterval(message.data.aggregationInterval);
          } else {
            setAuthStatus('authentication_error');
          }
          break;
        case 'input':
          setChatMessages((prev) => [...prev, message.data]);
          break;
        case 'messages':
          setChatMessages(message.data);
          break;
        case 'user_count':
          setOnlineCount(message.data.count);
          break;
        case 'move_executed': {
          setLastMoveExecuted(message.data);
          const chosen = message.data?.chosenCommand;
          const votes = message.data?.voteCounts || {};
          const votesSummary = Object.entries(votes)
            .map(([cmd, count]) => `${cmd}: ${count}`)
            .join(', ');
          const summary = chosen
            ? `executed ${chosen}${votesSummary ? ` — votes ${votesSummary}` : ''}`
            : 'executed a move';
          setChatMessages((prev) => [
            ...prev,
            {
              username: 'system',
              input: `🎮 ${summary}`,
              timestamp: message.data?.timestamp ?? Date.now(),
            },
          ]);
          break;
        }
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  const send = (data: object) => {
    wsServiceRef.current?.send(data);
  };

  return {
    chatMessages,
    onlineCount,
    authStatus,
    aggregationInterval,
    lastMoveExecuted,
    send,
  };
};
