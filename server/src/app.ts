import { WebSocketHandlers } from './utils/websockets/handlers.js';

const wsHandlers = new WebSocketHandlers();

const server = Bun.serve({
  port: process.env.PORT || 8080,
  async fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === '/socket') {
      if (server.upgrade(req)) {
        return;
      }
      return new Response('WebSocket upgrade failed', { status: 400 });
    }

    return new Response('Not found', { status: 404 });
  },
  websocket: {
    message(ws, message) {
      wsHandlers.handleMessage(ws, message.toString());
    },
    open(ws) {
      wsHandlers.handleOpen(ws);
    },
    close(ws, code, message) {
      wsHandlers.handleClose(ws);
    },
    drain(ws) {
      // handle backpressure
    },
  },
});

console.log(`CrowdPad server is running on port ${server.port}`);
