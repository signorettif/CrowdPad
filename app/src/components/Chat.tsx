import type { GameInput } from '../types';

interface ChatProps {
  messages: GameInput[];
  onlineCount: number;
  aggregationInterval?: number;
}

export const Chat = ({
  messages,
  onlineCount,
  aggregationInterval,
}: ChatProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-lg font-bold text-gray-800">Live Commands</h2>
      <div className="mb-4 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            Messages will appear here...
          </div>
        ) : (
          [...messages].reverse().map((msg) => (
            <div key={`${msg.timestamp}-${msg.username}`} className="mb-2">
              <span className="font-bold text-blue-600">{msg.username}</span>:
              <span className="ml-2 text-gray-800">{msg.input}</span>
              <span className="ml-2 text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="mb-2 text-sm text-gray-600">
        <span className="font-semibold">Online:</span>
        <span> {onlineCount}</span>
      </div>
      {aggregationInterval && (
        <div className="mb-2 text-sm text-gray-600">
          <span className="font-semibold">Aggregation interval:</span>
          <span> {(aggregationInterval / 1000).toFixed(2)} seconds</span>
        </div>
      )}
    </div>
  );
};
