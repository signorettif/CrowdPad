import { useState, useRef, useMemo } from 'react';

import type { AuthStatus } from '../types';
import { cn } from '../utils/cn';

const AUTH_STATUS_MESSAGES: Record<AuthStatus, string> = {
  not_authenticated: '',
  authenticated: 'Authenticated successfully!',
  authentication_error: 'Authentication failed. Please check your secret key.',
};

interface AuthProps {
  onAuthenticate: (secretKey: string) => void;
  authStatus: AuthStatus;
  username: string;
  setUsername: (username: string) => void;
}

export const Auth = ({
  onAuthenticate,
  authStatus,
  username,
  setUsername,
}: AuthProps) => {
  const [secretKey, setSecretKey] = useState('');
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const authStatusMessage = useMemo(
    () => AUTH_STATUS_MESSAGES[authStatus],
    [authStatus]
  );

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!secretKey.trim()) {
      alert('Please enter a secret key');
      return;
    }
    onAuthenticate(secretKey);
  };

  return (
    <form className="mb-6" onSubmit={handleAuthenticate}>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Secret Key
        </label>
        <input
          type="password"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter secret key"
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Username
        </label>
        <input
          ref={usernameInputRef}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter your username"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        Authenticate
      </button>

      {authStatusMessage && (
        <div
          className={cn('mt-2 text-center text-sm', {
            'text-green-600': authStatus === 'authenticated',
            'text-red-600': authStatus === 'authentication_error',
          })}
        >
          {authStatusMessage}
        </div>
      )}
    </form>
  );
};
