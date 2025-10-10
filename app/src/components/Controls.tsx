import { Auth } from './Auth';
import { Gamepad } from './Gamepad';

interface ControlsProps {
  onAuthenticate: (secretKey: string) => void;
  authStatus: {
    message: string;
    className: string;
  };
  username: string;
  setUsername: (username: string) => void;
  onGameInput: (input: string) => void;
  gameControlsDisabled: boolean;
  cooldown: number;
}

export const Controls = (props: ControlsProps) => {
  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow-lg">
      <Auth
        onAuthenticate={props.onAuthenticate}
        authStatus={props.authStatus}
        username={props.username}
        setUsername={props.setUsername}
      />
      <div className="mb-2 text-sm text-gray-600">
        <span className="font-semibold">Cooldown:</span>{' '}
        <span>{props.cooldown / 1000} seconds</span>
      </div>
      <Gamepad
        onGameInput={props.onGameInput}
        disabled={props.gameControlsDisabled}
      />
    </div>
  );
};
