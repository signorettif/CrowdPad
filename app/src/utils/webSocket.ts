import type { ServerMessage } from '../types/serverMessages';

// --- WebSocket Service (simplified from server/src/utils/websockets/service.ts) ---
export class WebSocketService {
  private ws: WebSocket;

  constructor(
    webSocketUrl = import.meta.env.VITE_WEBSOCKET_URL ||
      'ws://localhost:3000/socket'
  ) {
    this.ws = new WebSocket(webSocketUrl);
    console.log(this.ws);
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
        console.error('Failed to parse WebSocket message:', error);
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

  get() {
    return this.ws;
  }
}
