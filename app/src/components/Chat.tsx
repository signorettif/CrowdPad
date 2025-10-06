import type { GameInput } from '../types';

interface ChatProps {
  messages: GameInput[];
  onlineCount: number;
}

export const Chat = ({ messages, onlineCount }: ChatProps) => {
  return (
    <div className="flex-1 bg-white rounded-lg shadow-lg p-6 flex flex-col min-h-0">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Live Commands</h2>
      <div className="overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 max-h-96">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center">
            Messages will appear here...
          </div>
        ) : (
          [...messages].reverse().map((msg) => (
            <div key={`${msg.timestamp}-${msg.username}`} className="mb-2">
              <span className="font-bold text-blue-600">{msg.username}</span>:
              <span className="text-gray-800 ml-2">{msg.input}</span>
              <span className="text-xs text-gray-400 ml-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-semibold">Online:</span>{' '}
        <span>{onlineCount}</span>
      </div>
    </div>
  );
};
