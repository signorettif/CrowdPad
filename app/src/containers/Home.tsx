import { useState } from 'react';

import { Chat } from '../components/Chat';
import { Controls } from '../components/Controls';
import { useAuthContext } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';

export const Home = () => {
  const [lastInputTime, setLastInputTime] = useState(0);
  const { chatMessages, onlineCount, config, authStatus, send } =
    useWebSocket();
  const { authData } = useAuthContext();

  if (!config) {
    return <>Loading...</>;
  }

  const { cooldown, aggregationInterval } = config;

  const handleGameInput = (input: string) => {
    if (authStatus !== 'authenticated') {
      alert('Please authenticate first');
      return;
    }

    if (!authData?.username.trim()) {
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
      data: { username: authData.username.trim(), input },
    });
  };

  return (
    <main className="container mx-auto flex flex-col gap-6 p-6 lg:flex-row">
      <Controls onGameInput={handleGameInput} cooldown={cooldown} />
      <Chat
        messages={chatMessages}
        onlineCount={onlineCount}
        aggregationInterval={aggregationInterval}
      />
    </main>
  );
};
