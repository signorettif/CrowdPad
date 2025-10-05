import './db/schema.ts';
import { commandRoutes } from './routes/commands.js';
import { webSocketHandler } from './websockets.js';

const server = Bun.serve({
  port: process.env.PORT || 8080,
  routes: {
    ...commandRoutes,
  },
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === '/socket') {
      if (server.upgrade(req)) {
        return;
      }
      return new Response('WebSocket upgrade failed', { status: 400 });
    }
    return new Response('Not found', { status: 404 });
  },
  websocket: webSocketHandler,
});

console.log(`crowdpad-server is running on port ${server.port}`);
