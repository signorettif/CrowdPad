import React, { createContext, useContext, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuthContext } from './AuthContext';
import { getCookie } from '../utils/cookies';

interface WebSocketContextType {
  chatMessages: any[];
  onlineCount: number;
  aggregationInterval: number | undefined;
  send: (data: object) => void;
  authenticate: (secretKey: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setAuthStatus, setUsername, setSecretKey } = useAuthContext();
  const { chatMessages, onlineCount, aggregationInterval, send, authenticate } = useWebSocket({ onAuthStatusChange: setAuthStatus });

  useEffect(() => {
    const authCookie = getCookie('crowdpad_auth');
    if (authCookie) {
      const { username, secretKey } = JSON.parse(authCookie);
      setUsername(username);
      setSecretKey(secretKey);
      authenticate(secretKey);
    }
  }, [authenticate, setUsername, setSecretKey]);

  const value = { chatMessages, onlineCount, aggregationInterval, send, authenticate };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};