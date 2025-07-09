# CrowdPad Server

Hosts websocket and simple HTML page to send commands

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT`: Server port (default: 3000)
- `WEBSOCKET_SECRET_KEY`: Secret key for websocket authentication

## Features

- WebSocket-based real-time communication
- Secret key authentication for secure access
- Game controller interface
- Live chat functionality
- Rate limiting and input validation

## Usage

1. Set up environment variables in `.env`
2. Run the server: `bun run dev`
3. Open `http://localhost:3000` in your browser
4. Enter the secret key to authenticate
5. Use the game controller interface to send commands