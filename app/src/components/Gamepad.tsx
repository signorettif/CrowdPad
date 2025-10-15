import { useRef } from 'react';

import { useWebSocket } from '../contexts/WebSocketContext';

interface GamepadProps {
  username: string;
}

export const Gamepad = ({ username }: GamepadProps) => {
  const { authStatus, config, send } = useWebSocket();
  const isGamepadDisabled =
    authStatus !== 'authenticated' && typeof config?.cooldown === 'number';
  const lastInputTimeRef = useRef(0);

  const handleGameInput = (input: string) => {
    if (authStatus !== 'authenticated') {
      alert('Please authenticate first');
      return;
    }
    if (!username.trim()) {
      alert('Please enter a username.');
      return;
    }

    const lastInputTime = lastInputTimeRef.current;
    const currentTime = Date.now();
    if (config && currentTime - lastInputTime < config.cooldown) {
      const remainingTime = Math.ceil(
        (config.cooldown - (currentTime - lastInputTime)) / 1000
      );
      alert(
        `Please wait ${remainingTime} seconds before sending another input.`
      );
      return;
    }

    lastInputTimeRef.current = currentTime;
    send?.({
      type: 'input',
      data: { username: username.trim(), input },
    });
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-purple-200 p-8">
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="grid h-24 w-24 grid-cols-3 gap-1">
            <div />
            <button
              data-input="up"
              className="flex items-center justify-center rounded-sm bg-gray-800 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => handleGameInput('up')}
              disabled={isGamepadDisabled}
              aria-disabled={isGamepadDisabled}
            >
              ▲
            </button>
            <div />
            <button
              data-input="left"
              className="flex items-center justify-center rounded-sm bg-gray-800 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => handleGameInput('left')}
              disabled={isGamepadDisabled}
              aria-disabled={isGamepadDisabled}
            >
              ◀
            </button>
            <div className="rounded-sm bg-gray-600" />
            <button
              data-input="right"
              className="flex items-center justify-center rounded-sm bg-gray-800 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => handleGameInput('right')}
              disabled={isGamepadDisabled}
              aria-disabled={isGamepadDisabled}
            >
              ▶
            </button>
            <div />
            <button
              data-input="down"
              className="flex items-center justify-center rounded-sm bg-gray-800 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => handleGameInput('down')}
              disabled={isGamepadDisabled}
              aria-disabled={isGamepadDisabled}
            >
              ▼
            </button>
            <div />
          </div>
        </div>

        <div className="space-y-2">
          <button
            data-input="b"
            className="h-12 w-12 rounded-full bg-red-500 font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleGameInput('b')}
            disabled={isGamepadDisabled}
            aria-disabled={isGamepadDisabled}
          >
            B
          </button>
          <button
            data-input="a"
            className="ml-4 h-12 w-12 rounded-full bg-red-500 font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleGameInput('a')}
            disabled={isGamepadDisabled}
            aria-disabled={isGamepadDisabled}
          >
            A
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          data-input="select"
          className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleGameInput('select')}
          disabled={isGamepadDisabled}
          aria-disabled={isGamepadDisabled}
        >
          SELECT
        </button>
        <button
          data-input="start"
          className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleGameInput('start')}
          disabled={isGamepadDisabled}
          aria-disabled={isGamepadDisabled}
        >
          START
        </button>
      </div>
    </div>
  );
};
