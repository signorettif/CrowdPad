export const withAdminAuth = (
  handler: (req: Request) => Response | Promise<Response>
) => {
  return (req: Request) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (token !== process.env.ADMIN_KEY) {
      return new Response('Unauthorized', { status: 401 });
    }

    return handler(req);
  };
};
