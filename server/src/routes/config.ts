import { withAdminAuth } from '../middleware/auth';
import { withCors } from '../middleware/cors';
import { config, type ConfigKey } from '../utils/config';

export const configRoutes = {
  '/api/v1/config': {
    GET: withCors(() => {
      try {
        return Response.json(config.getAll());
      } catch (error) {
        console.error('Error fetching configs:', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    }),
    POST: withCors(
      withAdminAuth(async (req: Request) => {
        try {
          const payload = await req.json();
          if (
            typeof payload !== 'object' ||
            payload === null ||
            Array.isArray(payload)
          ) {
            return new Response('Request body must be a JSON object', {
              status: 400,
            });
          }

          const keys = Object.keys(payload);

          for (const key of keys) {
            const value = payload[key];
            if (!config.hasKey(key)) {
              return new Response(`Configuration key '${key}' does not exist`, {
                status: 400,
              });
            }
            if (!config.isValueValidForKey(key as ConfigKey, value)) {
              return new Response(`Invalid value for key '${key}': ${value}`, {
                status: 400,
              });
            }
          }

          for (const key of keys) {
            const value = payload[key];
            config.update(key as ConfigKey, value);
          }

          return Response.json(payload);
        } catch (error) {
          // Bun's req.json() throws a generic error on invalid JSON.
          if (error instanceof Error && error.message.includes('JSON')) {
            return new Response('Invalid JSON body', { status: 400 });
          }
          console.error('Error writing config:', error);
          return new Response('Internal Server Error', { status: 500 });
        }
      })
    ),
  },
  '/api/v1/config/:key': {
    GET: withAdminAuth(async (req: Request) => {
      const url = new URL(req.url);
      const key = url.pathname.split('/').pop();

      if (!config.getAllKeys().includes(key)) {
        return new Response(`Configuration key ${key} does not exist`, {
          status: 404,
        });
      }

      try {
        const { value } = await req.json();
        config.update(key as ConfigKey, value);
        return new Response(JSON.stringify({ key, value }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error writing config:', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    }),
  },
};
