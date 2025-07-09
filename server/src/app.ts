import { WebSocketHandlers } from './utils/websockets/handlers.js';


const wsHandlers = new WebSocketHandlers();

const server = Bun.serve({
    port: process.env.PORT || 3000,
    async fetch(req, server) {
        const url = new URL(req.url);

        if (url.pathname === "/socket") {
            if (server.upgrade(req)) {
                return;
            }
            return new Response("WebSocket upgrade failed", { status: 400 });
        }

        if (url.pathname === "/") {
            return new Response(Bun.file("public/index.html"), {
                headers: { "Content-Type": "text/html" },
            });
        }

        // Serve TypeScript files transpiled to JavaScript
        if (url.pathname.startsWith("/src/") && (url.pathname.endsWith(".ts") || url.pathname.endsWith(".js"))) {
            let filePath = url.pathname.slice(1); // Remove leading slash

            // Handle .js requests by trying to find corresponding .ts file
            if (url.pathname.endsWith(".js")) {
                filePath = filePath.replace(/\.js$/, ".ts");
            }

            const file = Bun.file(filePath);
            if (await file.exists()) {
                const transpiler = new Bun.Transpiler({
                    loader: "ts",
                    target: "browser"
                });
                const transpiled = await transpiler.transform(await file.text());
                return new Response(transpiled, {
                    headers: {
                        "Content-Type": "application/javascript",
                        "Cache-Control": "no-cache"
                    },
                });
            }
        }

        return new Response("Not found", { status: 404 });
    },
    websocket: {
        message(ws, message) {
            wsHandlers.handleMessage(ws, message.toString());
        },
        open(ws) {
            wsHandlers.handleOpen(ws);
        },
        close(ws, code, message) {
            wsHandlers.handleClose(ws);
        },
        drain(ws) {
            // handle backpressure
        },
    },
});

console.log(`CrowdPad server is running on port ${server.port}`);