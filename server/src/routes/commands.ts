import { db } from '../db';
import { JSONParse, JSONStringify } from 'json-with-bigint';
import { withAdminAuth } from '../middleware/auth';

export const commandRoutes = {
  '/api/v1/commands': withAdminAuth((req: Request) => {
    const url = new URL(req.url);
    const startTime = url.searchParams.get('startTime');
    const endTime = url.searchParams.get('endTime');

    if (!startTime || !endTime) {
      return new Response('Missing startTime or endTime', { status: 400 });
    }

    try {
      const commands = db
        .query('SELECT * FROM commands WHERE timestamp >= ? AND timestamp <= ?')
        .all(Number(startTime), Number(endTime));

      return new Response(JSONStringify(commands), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching commands:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }),
};
