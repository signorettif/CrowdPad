interface GamepadProps {
  onGameInput: (input: string) => void;
  disabled: boolean;
}

export const Gamepad = ({ onGameInput, disabled }: GamepadProps) => {
  return (
    <div
      className="mx-auto max-w-md rounded-lg bg-purple-200 p-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
      tabIndex={0}
      onKeyDown={(e) => {
        if (disabled) return;

        if (e.code === "ArrowUp") {
          e.preventDefault();
          onGameInput("up");
        } else if (e.code === "ArrowDown") {
          e.preventDefault();
          onGameInput("down");
        } else if (e.code === "ArrowLeft") {
          e.preventDefault();
          onGameInput("left");
        } else if (e.code === "ArrowRight") {
          e.preventDefault();
          onGameInput("right");
        } else if (e.code === "KeyA") {
          e.preventDefault();
          onGameInput("a");
        } else if (e.code === "KeyB") {
          e.preventDefault();
          onGameInput("b");
        } else if (e.code === "Enter") {
          e.preventDefault();
          onGameInput("start");
        } else if (e.code === "Space") {
          e.preventDefault();
          onGameInput("select");
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="grid h-24 w-24 grid-cols-3 gap-1">
            <div />
            <button
              onClick={() => onGameInput('up')}
              data-input="up"
              disabled={disabled}
              className="flex items-center justify-center rounded-sm bg-gray-800 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ▲
            </button>
            <div />
            <button
              onClick={() => onGameInput('left')}
              data-input="left"
              disabled={disabled}
              className="flex items-center justify-center rounded-sm bg-gray-800 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ◀
            </button>
            <div className="rounded-sm bg-gray-600" />
            <button
              onClick={() => onGameInput('right')}
              data-input="right"
              disabled={disabled}
              className="flex items-center justify-center rounded-sm bg-gray-800 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ▶
            </button>
            <div />
            <button
              onClick={() => onGameInput('down')}
              data-input="down"
              disabled={disabled}
              className="flex items-center justify-center rounded-sm bg-gray-800 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ▼
            </button>
            <div />
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onGameInput('b')}
            data-input="b"
            disabled={disabled}
            className="h-12 w-12 rounded-full bg-red-500 font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            B
          </button>
          <button
            onClick={() => onGameInput('a')}
            data-input="a"
            disabled={disabled}
            className="ml-4 h-12 w-12 rounded-full bg-red-500 font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            A
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => onGameInput('select')}
          data-input="select"
          disabled={disabled}
          className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          SELECT
        </button>
        <button
          onClick={() => onGameInput('start')}
          data-input="start"
          disabled={disabled}
          className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          START
        </button>
      </div>
    </div>
  );
};
