import { useState, useEffect, useRef } from 'react';
import { getSocketUri } from '../utils/socket';
import type { GameInput, ServerMessage } from '../types';

// --- WebSocket Service (simplified from server/src/utils/websockets/service.ts) ---
class WebSocketService {
    private ws: WebSocket;

    constructor(url: string) {
        this.ws = new WebSocket(url);
    }

    onOpen(callback: () => void) {
        this.ws.onopen = callback;
    }

    onMessage(callback: (message: ServerMessage) => void) {
        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                callback(message);
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        };
    }

    send(data: object) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    close() {
        this.ws.close();
    }
}

export const useWebSocket = () => {
    const [chatMessages, setChatMessages] = useState<GameInput[]>([]);
    const [onlineCount, setOnlineCount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authStatus, setAuthStatus] = useState({ message: '', className: 'mt-2 text-sm text-center' });
    const wsServiceRef = useRef<WebSocketService | null>(null);

    useEffect(() => {
        const ws = new WebSocketService(getSocketUri());
        wsServiceRef.current = ws;

        ws.onOpen(() => {
            ws.send({ type: 'join' });
        });

        ws.onMessage((message: ServerMessage) => {
            switch (message.type) {
                case 'auth_status':
                    if (message.data.authenticated) {
                        setIsAuthenticated(true);
                        setAuthStatus({ message: 'Authenticated successfully!', className: 'mt-2 text-sm text-center text-green-600' });
                        ws.send({ type: 'get_messages' });
                    } else {
                        setIsAuthenticated(false);
                        setAuthStatus({ message: 'Authentication failed. Please check your secret key.', className: 'mt-2 text-sm text-center text-red-600' });
                    }
                    break;
                case 'input':
                    setChatMessages(prev => [...prev, message.data]);
                    break;
                case 'messages':
                    setChatMessages(message.data);
                    break;
                case 'user_count':
                    setOnlineCount(message.data.count);
                    break;
            }
        });

        return () => {
            ws.close();
        };
    }, []);

    const send = (data: object) => {
        wsServiceRef.current?.send(data);
    }

    return { chatMessages, onlineCount, isAuthenticated, authStatus, send };
};
