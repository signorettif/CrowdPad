export const withCors = (
  handler: (req: Request, server: any) => Response | Promise<Response>
) => {
  return async (req: Request, server: any) => {
    const origin = req.headers.get('origin');
    const allowedOrigins = (process.env.CORS_ALLOW_ORIGINS || '').split(',');

    if (origin && allowedOrigins.includes(origin)) {
      const response = await handler(req, server);
      if (response) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set(
          'Access-Control-Allow-Methods',
          'GET, POST, OPTIONS'
        );
        response.headers.set(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization'
        );
      }
      return response;
    }

    return handler(req, server);
  };
};
