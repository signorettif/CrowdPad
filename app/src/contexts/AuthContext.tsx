import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { AUTH_COOKIE } from '../constants/cookies';
import { getCookie, setCookie } from '../utils/cookies';
import { useWebSocket } from './WebSocketContext';

interface AuthContextType {
  authData:
    | {
        username: string;
        secretKey: string;
      }
    | undefined;
  isAuthenticated: boolean;
  authenticate: (username: string, secretKey: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authStatus, send } = useWebSocket();
  const [authData, setAuthData] =
    useState<AuthContextType['authData']>(undefined);

  const authenticate = useCallback(
    (username: string, secretKey: string) => {
      setAuthData({ username, secretKey });
      send({ type: 'auth', data: { username, secretKey } });
    },
    [send]
  );

  // Try to authenticate based on existing cookie on first mount
  useEffect(() => {
    const authCookie = getCookie(AUTH_COOKIE);
    if (authCookie) {
      try {
        const { username, secretKey } = JSON.parse(authCookie);
        if (username && secretKey) {
          authenticate(username, secretKey);
        }
      } catch (e) {
        // Cookie is malformed, clear it
        // setCookie(AUTH_COOKIE, '', -1);
      }
    }
  }, [authenticate]);

  // Listen to authentication messages and update cookie accordingly
  useEffect(() => {
    console.log(authStatus);
    if (authStatus === 'authenticated') {
      setCookie(AUTH_COOKIE, JSON.stringify(authData), 7);
    } else {
      // The backend will invalidate the session, but we also clear the cookie here
      // for good measure, in case of auth failure.
      // setCookie(AUTH_COOKIE, '', -1);
    }
  }, [authStatus, authData]);

  const logout = () => {
    setCookie(AUTH_COOKIE, '', -1);
    setAuthData(undefined);
  };

  const value = {
    authData,
    isAuthenticated: authStatus === 'authenticated',
    authenticate,
    logout,
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
