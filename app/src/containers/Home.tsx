import { Controls } from '../components/Controls';
import { Chat } from '../components/Chat';
import { WebSocketProvider } from '../contexts/WebSocketContext';

export const Home = () => {
  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-4">
          <div className="flex flex-col gap-6 lg:flex-row">
            <Controls />
            <Chat />
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};
