import { Gamepad } from './Gamepad';
import { useAuthContext } from '../contexts/AuthContext';

interface ControlsProps {
  onGameInput: (input: string) => void;
  cooldown: number;
}

export const Controls = ({ onGameInput, cooldown }: ControlsProps) => {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-2 text-sm text-gray-600">
        <span className="font-semibold">Cooldown:</span>{' '}
        <span>{cooldown / 1000} seconds</span>
      </div>
      <Gamepad onGameInput={onGameInput} disabled={!isAuthenticated} />
    </div>
  );
};
