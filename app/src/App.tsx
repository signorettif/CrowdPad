import { useState } from 'react';
import './style.css';
import { useWebSocket } from './hooks/useWebSocket';
import { Controls } from './components/Controls';
import { Chat } from './components/Chat';

const INPUT_COOLDOWN = 1000; // 1 second

function App() {
    const [username, setUsername] = useState('');
    const [lastInputTime, setLastInputTime] = useState(0);
    const { chatMessages, onlineCount, isAuthenticated, authStatus, send } = useWebSocket();

    const handleAuthenticate = (secretKey: string) => {
        send({
            type: 'auth',
            data: { secretKey },
        });
    };

    const handleGameInput = (input: string) => {
        if (!isAuthenticated) {
            alert('Please authenticate first');
            return;
        }

        if (!username.trim()) {
            alert('Please enter a username.');
            return;
        }

        const currentTime = Date.now();
        if (currentTime - lastInputTime < INPUT_COOLDOWN) {
            const remainingTime = Math.ceil((INPUT_COOLDOWN - (currentTime - lastInputTime)) / 1000);
            alert(`Please wait ${remainingTime} seconds before sending another input.`);
            return;
        }

        setLastInputTime(currentTime);
        send({
            type: 'input',
            data: { username: username.trim(), input },
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    <Controls 
                        onAuthenticate={handleAuthenticate} 
                        authStatus={authStatus} 
                        username={username} 
                        setUsername={setUsername} 
                        onGameInput={handleGameInput} 
                        gameControlsDisabled={!isAuthenticated} 
                    />
                    <Chat messages={chatMessages} onlineCount={onlineCount} />
                </div>
            </div>
        </div>
    );
}

export default App;
