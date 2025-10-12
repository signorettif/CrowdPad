import { useWebSocket } from '../contexts/WebSocketContext';
import { cn } from '../utils/cn';

import type { FormEventHandler } from 'react';
import type { AuthStatus } from '../types';

const AUTH_STATUS_MESSAGES: Record<AuthStatus, string> = {
  not_authenticated: '',
  authenticated: 'Authenticated successfully!',
  authentication_error: 'Authentication failed. Please check your secret key.',
};

interface AuthProps {
  onAuthenticationSuccess: (authenticatedUsername: string) => void;
}

export const Auth = ({ onAuthenticationSuccess }: AuthProps) => {
  const { authStatus, send } = useWebSocket();
  const authStatusMessage = AUTH_STATUS_MESSAGES[authStatus];
  const isAuthenticationDisabled = authStatus === 'authenticated';

  const handleAuthenticate: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    const secretKey = formData.get('secretKey') as string;
    const username = formData.get('username') as string;
    if (!secretKey?.trim()) {
      alert('Please enter a secret key');
      return;
    }
    if (!username?.trim()) {
      alert('Please enter a secret key');
      return;
    }

    send({
      type: 'auth',
      data: { secretKey },
    });
    onAuthenticationSuccess(username);
  };

  return (
    <form
      className="mb-6"
      onSubmit={handleAuthenticate}
      aria-disabled={isAuthenticationDisabled}
    >
      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Secret Key
        </label>
        <input
          type="password"
          name="secretKey"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter secret key"
          disabled={isAuthenticationDisabled}
          aria-disabled={isAuthenticationDisabled}
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Username
        </label>
        <input
          type="text"
          name="username"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter your username"
          disabled={isAuthenticationDisabled}
          aria-disabled={isAuthenticationDisabled}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        disabled={isAuthenticationDisabled}
        aria-disabled={isAuthenticationDisabled}
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
