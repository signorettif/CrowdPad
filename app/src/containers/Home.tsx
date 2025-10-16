import { useState } from 'react';

import { Controls } from '../components/Controls';
import { Chat } from '../components/Chat';

import { useWebSocket } from '../hooks/useWebSocket';

export const Home = () => {
  const [username, setUsername] = useState('');
  const [lastInputTime, setLastInputTime] = useState(0);
  const { chatMessages, onlineCount, config, authStatus, send } =
    useWebSocket();
  const { cooldown, aggregationInterval } = config;

  const handleAuthenticate = (secretKey: string) => {
    send({
      type: 'auth',
      data: { secretKey },
    });
  };

  const handleGameInput = (input: string) => {
    if (authStatus !== 'authenticated') {
      alert('Please authenticate first');
      return;
    }

    if (!username.trim()) {
      alert('Please enter a username.');
      return;
    }

    const currentTime = Date.now();
    if (currentTime - lastInputTime < cooldown) {
      const remainingTime = Math.ceil(
        (cooldown - (currentTime - lastInputTime)) / 1000
      );
      alert(
        `Please wait ${remainingTime} seconds before sending another input.`
      );
      return;
    }

    setLastInputTime(currentTime);
    send({
      type: 'input',
      data: { username: username.trim(), input },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-6 lg:flex-row">
          <Controls
            onAuthenticate={handleAuthenticate}
            authStatus={authStatus}
            username={username}
            setUsername={setUsername}
            onGameInput={handleGameInput}
            cooldown={cooldown}
          />
          <Chat
            messages={chatMessages}
            onlineCount={onlineCount}
            aggregationInterval={aggregationInterval}
          />
        </div>
      </div>
    </div>
  );
};
