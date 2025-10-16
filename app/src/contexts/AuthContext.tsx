import React, { createContext, useContext, useState } from 'react';
import { AuthStatus } from '../types';
import { getCookie, setCookie } from '../utils/cookies';
import { useWebSocketContext } from './WebSocketContext';

interface AuthContextType {
  username: string;
  isAuthenticated: boolean;
  login: (username: string, secretKey: string) => void;
  logout: () => void;
  authStatus: AuthStatus;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [authStatus, setAuthStatus] = useState<AuthStatus>('not_authenticated');
  const { authenticate } = useWebSocketContext();

  const login = (username: string, secretKey: string) => {
    const authData = JSON.stringify({ username, secretKey });
    setCookie('crowdpad_auth', authData, 7);
    setUsername(username);
    setSecretKey(secretKey);
    authenticate(secretKey);
  };

  const logout = () => {
    setCookie('crowdpad_auth', '', -1);
    setUsername('');
    setSecretKey('');
    setAuthStatus('not_authenticated');
  };

  const value = {
    username,
    isAuthenticated: authStatus === 'authenticated',
    login,
    logout,
    authStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};