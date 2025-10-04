interface GamepadProps {
    onGameInput: (input: string) => void;
    disabled: boolean;
}

export const Gamepad = ({ onGameInput, disabled }: GamepadProps) => {
    return (
        <div className="bg-purple-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="flex justify-between items-center">
                <div className="relative">
                    <div className="grid grid-cols-3 gap-1 w-24 h-24">
                        <div />
                        <button onClick={() => onGameInput('up')} data-input="up" disabled={disabled} className="bg-gray-800 text-white rounded-sm hover:bg-gray-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">▲</button>
                        <div />
                        <button onClick={() => onGameInput('left')} data-input="left" disabled={disabled} className="bg-gray-800 text-white rounded-sm hover:bg-gray-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">◀</button>
                        <div className="bg-gray-600 rounded-sm" />
                        <button onClick={() => onGameInput('right')} data-input="right" disabled={disabled} className="bg-gray-800 text-white rounded-sm hover:bg-gray-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">▶</button>
                        <div />
                        <button onClick={() => onGameInput('down')} data-input="down" disabled={disabled} className="bg-gray-800 text-white rounded-sm hover:bg-gray-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">▼</button>
                        <div />
                    </div>
                </div>

                <div className="space-y-2">
                    <button onClick={() => onGameInput('b')} data-input="b" disabled={disabled} className="w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed">B</button>
                    <button onClick={() => onGameInput('a')} data-input="a" disabled={disabled} className="w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 font-bold ml-4 disabled:opacity-50 disabled:cursor-not-allowed">A</button>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button onClick={() => onGameInput('select')} data-input="select" disabled={disabled} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed">SELECT</button>
                <button onClick={() => onGameInput('start')} data-input="start" disabled={disabled} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed">START</button>
            </div>
        </div>
    );
};