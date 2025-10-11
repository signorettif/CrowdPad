import { useState } from 'react';
import { Auth } from './Auth';
import { Gamepad } from './Gamepad';
import { useWebSocket } from '../contexts/WebSocketContext';

export const Controls = () => {
  const { config } = useWebSocket();
  const [username, setUsername] = useState('');

  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow-lg">
      <Auth
        onAuthenticationSuccess={(authenticatedUsername) => {
          setUsername(authenticatedUsername);
        }}
      />
      {config?.cooldown && (
        <div className="mb-2 text-sm text-gray-600">
          <span className="font-semibold">Cooldown:</span>
          <span> {(config.cooldown / 1000).toFixed(2)} seconds</span>
        </div>
      )}
      <Gamepad username={username} />
    </div>
  );
};
