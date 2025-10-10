import { WebSocketHandlers } from './utils/websockets/handlers.js';

const wsHandlers = new WebSocketHandlers();

export const webSocketHandler = {
  message(ws: any, message: any) {
    wsHandlers.handleMessage(ws, message.toString());
  },
  open(ws: any) {
    wsHandlers.handleOpen(ws);
  },
  close(ws: any, _code: any, _message: any) {
    wsHandlers.handleClose(ws);
  },
  drain(_ws: any) {
    // handle backpressure
  },
};
