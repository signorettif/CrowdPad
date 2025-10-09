import { useState, useRef } from 'react';

interface AuthProps {
    onAuthenticate: (secretKey: string) => void;
    authStatus: {
        message: string;
        className: string;
    };
    username: string;
    setUsername: (username: string) => void;
}

export const Auth = ({ onAuthenticate, authStatus, username, setUsername }: AuthProps) => {
    const [secretKey, setSecretKey] = useState('');
    const usernameInputRef = useRef<HTMLInputElement>(null);

    const handleAuthenticate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!secretKey.trim()) {
            alert('Please enter a secret key');
            return;
        }
        onAuthenticate(secretKey);
    };

    return (
        <form className="mb-6" onSubmit={handleAuthenticate} >
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Secret Key</label>
                <input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter secret key"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input
                    ref={usernameInputRef}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your username"
                />
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Authenticate
            </button>
            <div className={authStatus.className}>{authStatus.message}</div>
        </form>
    );
};