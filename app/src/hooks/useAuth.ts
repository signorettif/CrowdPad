import { useState, useEffect } from 'react';
import { getCookie, setCookie } from '../utils/cookies';
import { useWebSocket } from './useWebSocket';
import { AuthStatus } from '../types';

export const useAuth = () => {
  const [username, setUsername] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [authStatus, setAuthStatus] = useState<AuthStatus>('not_authenticated');

  const { authenticate } = useWebSocket({
    onAuthStatusChange: setAuthStatus,
  });

  useEffect(() => {
    const authCookie = getCookie('crowdpad_auth');
    if (authCookie) {
      const { username, secretKey } = JSON.parse(authCookie);
      setUsername(username);
      setSecretKey(secretKey);
      authenticate(secretKey);
    }
  }, [authenticate]);

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

  return { username, secretKey, isAuthenticated: authStatus === 'authenticated', login, logout, authStatus };
};
