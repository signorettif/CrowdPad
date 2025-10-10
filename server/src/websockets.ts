import { WebSocketHandlers } from './utils/websockets/handlers';

import type { ServerWebSocket } from 'bun';

const wsHandlers = new WebSocketHandlers();

export const webSocketHandler = {
  message(ws: ServerWebSocket, message: string | Buffer) {
    wsHandlers.handleMessage(ws, message.toString());
  },
  open(ws: ServerWebSocket) {
    wsHandlers.handleOpen(ws);
  },
  close(ws: ServerWebSocket, _code: number, _message: string) {
    wsHandlers.handleClose(ws);
  },
  drain(_ws: ServerWebSocket) {
    // handle backpressure
  },
};
