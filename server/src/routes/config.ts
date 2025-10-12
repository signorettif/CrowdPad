import { withAdminAuth } from '../middleware/auth';
import { withCors } from '../middleware/cors';
import { config, type ConfigKey } from '../utils/config';

export const configRoutes = {
  '/api/v1/config': withCors((req: Request) => {
    if (req.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      return new Response(JSON.stringify(config.getAll()), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching configs:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }),

  '/api/v1/config/': withAdminAuth(async (req: Request) => {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    for (key of keys) {
      if (!config.hasKey(key)) {
        return new Response(`Configuration key ${key} does not exist`, {
          status: 404,
        });
      } else if (!config.isValueValidForKey(key, value))
        return new Response(`Value ${} for key ${key} must be a number`, {
          status: 400,
        });
    }

    try {
      for (key of keys) {
        const { value } = await req.json();
        config.update(key as ConfigKey, value);
      }
      return new Response(JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error writing config:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }),

  '/api/v1/config/:key': withAdminAuth(async (req: Request) => {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

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
};
