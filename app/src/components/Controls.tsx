import { Auth } from './Auth';
import { Gamepad } from './Gamepad';

import type { AuthStatus } from '../types';

interface ControlsProps {
  onAuthenticate: (secretKey: string) => void;
  authStatus: AuthStatus;
  username: string;
  setUsername: (username: string) => void;
  onGameInput: (input: string) => void;
  cooldown: number;
}

export const Controls = ({
  onAuthenticate,
  authStatus,
  username,
  setUsername,
  onGameInput,
  cooldown,
}: ControlsProps) => {
  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow-lg">
      <Auth
        onAuthenticate={onAuthenticate}
        authStatus={authStatus}
        username={username}
        setUsername={setUsername}
      />
      <div className="mb-2 text-sm text-gray-600">
        <span className="font-semibold">Cooldown:</span>{' '}
        <span>{cooldown / 1000} seconds</span>
      </div>
      <Gamepad
        onGameInput={onGameInput}
        disabled={authStatus !== 'authenticated'}
      />
    </div>
  );
};
