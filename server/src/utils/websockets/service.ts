/**
 * WebSocket service for handling real-time communication
 */

import type {  ClientMessage, ServerMessage } from '../../types/shared.js';

export class WebSocketService {
    private ws: WebSocket;
    private onMessageCallback?: (message: ServerMessage) => void;
    private onOpenCallback?: () => void;
    private onCloseCallback?: () => void;

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.ws.onopen = () => {
            console.log('Connected to WebSocket');
            this.onOpenCallback?.();
        };

        this.ws.onmessage = (event) => {
            try {
                const message: ServerMessage = JSON.parse(event.data);
                this.onMessageCallback?.(message);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected from WebSocket');
            this.onCloseCallback?.();
        };
    }

    public onMessage(callback: (message: ServerMessage) => void): void {
        this.onMessageCallback = callback;
    }

    public onOpen(callback: () => void): void {
        this.onOpenCallback = callback;
    }

    public onClose(callback: () => void): void {
        this.onCloseCallback = callback;
    }

    public send(message: ClientMessage): void {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not open. Ready state:', this.ws.readyState);
        }
    }

    public close(): void {
        this.ws.close();
    }
}
