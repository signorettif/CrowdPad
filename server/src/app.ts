import './db/schema.ts';
import { commandRoutes } from './routes/commands.js';
import { configRoutes } from './routes/config.js';
import { webSocketHandler } from './websockets.js';

const server = Bun.serve({
  port: process.env.PORT || 8080,
  routes: {
    ...commandRoutes,
    ...configRoutes,
  },
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === '/socket') {
      const authHeader = req.headers.get("authorization");
      if (!authHeader) {
        return new Response("Unauthorized", { status: 401 });
      }
  
      const token = authHeader.split(" ")[1];
      if (token !== process.env.ADMIN_KEY) {
        return new Response("Unauthorized", { status: 401 });
      }

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
