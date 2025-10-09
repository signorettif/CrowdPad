import { JSONStringify } from 'json-with-bigint';

import { db } from '../db';
import { withAdminAuth } from '../middleware/auth';
import { withCors } from '../middleware/cors';

export const commandRoutes = {
  '/api/v1/commands': withCors(
    withAdminAuth((req: Request) => {
      const url = new URL(req.url);
      const startTime = url.searchParams.get('startTime');

      if (!startTime) {
        return new Response('Missing startTime', { status: 400 });
      }

      try {
        let commands;
        if (url.searchParams.has('endTime')) {
          const endTime = url.searchParams.get('endTime');

          commands = db
            .query(
              'SELECT * FROM commands WHERE timestamp >= ? AND timestamp <= ?'
            )
            .all(Number(startTime), Number(endTime));
        } else {
          commands = db
            .query('SELECT * FROM commands WHERE timestamp >= ?')
            .all(Number(startTime));
        }

        return new Response(JSONStringify(commands), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error fetching commands:', error);
        return new Response('Internal Server Error', { status: 500 });
      }
    })
  ),
};
