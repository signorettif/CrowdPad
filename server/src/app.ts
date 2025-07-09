const server = Bun.serve({
  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/socket") {
      if (server.upgrade(req)) {
        return;
      }
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    if (url.pathname === "/") {
      return new Response(Bun.file("src/pages/home/index.html"), {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
  websocket: {
    message(ws, message) {
      // handle incoming messages
    },
    open(ws) {
      // handle new connection
    },
    close(ws, code, message) {
      // handle close
    },
    drain(ws) {
      // handle backpressure
    },
  },
});

console.log(`WebSocket server is running on port ${server.port}`);