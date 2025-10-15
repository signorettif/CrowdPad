import './db/schema.ts';

import { configRoutes } from './routes/config.js';
import { webSocketHandler } from './websockets.js';

const server = Bun.serve({
  port: process.env.PORT || 8080,
  routes: {
    ...configRoutes,
  },
  fetch: (req, server) => {
    const url = new URL(req.url);
    if (url.pathname === '/health') {
      return new Response('healthy', { status: 200 });
    }

    if (url.pathname === '/socket') {
      if (server.upgrade(req)) {
        return;
      }
      return new Response('WebSocket upgrade failed', { status: 400 });
    }

    if (req.method === 'OPTIONS') {
      const headers = {
        'Access-Control-Allow-Origin': (
          process.env.CORS_ALLOW_ORIGINS || ''
        ).split(','),
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };
      return new Response(null, { status: 204, headers });
    }

    return new Response('Not found', { status: 404 });
  },
  websocket: webSocketHandler,
});

console.log(`crowdpad-server is running on port ${server.port}`);
