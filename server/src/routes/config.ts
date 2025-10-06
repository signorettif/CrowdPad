import { db } from '../db';
import { withAdminAuth } from '../middleware/auth';
import { bustConfigCache } from '../utils/config';

export const configRoutes = {
  '/api/v1/config': withAdminAuth((req: Request) => {
    if (req.method === 'GET') {
      try {
        const configs = db.query('SELECT * FROM config').all();
        return new Response(JSON.stringify(configs), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error fetching configs:', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    }
    return new Response('Method not allowed', { status: 405 });
  }),

  '/api/v1/config/:key': withAdminAuth(async (req: Request) => {
    const url = new URL(req.url);
    const key = url.pathname.split('/').pop();

    if (req.method === 'POST') {
      try {
        const { value } = await req.json();
        db.run(
          'INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)',
          key,
          value
        );
        bustConfigCache(key);
        return new Response(JSON.stringify({ key, value }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error writing config:', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    }
    return new Response('Method not allowed', { status: 405 });
  }),
};
