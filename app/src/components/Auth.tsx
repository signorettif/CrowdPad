import { useState, useRef } from 'react';

interface AuthProps {
  onAuthenticate: (secretKey: string) => void;
  authStatus: {
    message: string;
    className: string;
  };
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
      <div className={authStatus.className}>{authStatus.message}</div>
    </form>
  );
};
