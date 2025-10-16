import { WebSocketHandlers } from './utils/websockets/handlers';

import type { WebSocketHandler } from 'bun';

const wsHandlers = new WebSocketHandlers();

export const webSocketHandler: WebSocketHandler = {
  message(ws, message) {
    wsHandlers.handleMessage(ws, message.toString());
  },
  open(ws) {
    wsHandlers.handleOpen(ws);
  },
  close(ws) {
    wsHandlers.handleClose(ws);
  },
  drain() {
    // handle backpressure
  },
};
