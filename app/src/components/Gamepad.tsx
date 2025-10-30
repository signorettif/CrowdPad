interface GamepadProps {
  onGameInput: (input: string) => void;
  disabled: boolean;
}

export const Gamepad = ({ onGameInput, disabled }: GamepadProps) => {
  return (
    <div className="mx-auto max-w-md rounded-lg bg-purple-200 p-8"
      onKeyDown={(e) => {
      if (e.code === "ArrowUp") {
          onGameInput("up");
      } else if (e.code === "ArrowDown") {
          onGameInput("down");
      } else if (e.code === "ArrowLeft") {
          onGameInput("left");
      } else if (e.code === "ArrowRight") {
          onGameInput("right");
      } else if (e.code === "KeyA") {
          onGameInput("a");
      } else if (e.code === "KeyB") {
          onGameInput("b");
      } else if (e.code === "Enter") {
          onGameInput("start");
      } else if (e.code === "Space") {
          onGameInput("select");
      }
    }}>
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
<<<<<<< HEAD

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
||||||| parent of 1d651ef (Add keyboard shortcuts)
    );
};
=======
    );
>>>>>>> 1d651ef (Add keyboard shortcuts)
};
