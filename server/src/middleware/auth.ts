export const withAdminAuth = (
  handler: (req: Request) => Response | Promise<Response>
) => {
  return (req: Request) => {
    const authHeader = req.headers.get('authorization');
    const authToken = authHeader.split(' ')[1];
    if (authToken !== process.env.ADMIN_KEY) {
      return new Response('Unauthorized', { status: 401 });
    }

    return handler(req);
  };
};
