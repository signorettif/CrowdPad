#!/usr/bin/env bun
import meow from 'meow';
import { checkMgbaServerRunning, sendKey, closePersistentSocket } from './utils/mgbaHttp.js';

const cli = meow(`
    Usage
      $ crowdpad [options]

    Options
      --server, -s  Server URL (default: http://localhost:3000)
      --help        Show help
      --version     Show version

    Examples
      $ crowdpad
      $ crowdpad --server http://localhost:3000
`, {
    importMeta: import.meta,
    flags: {
        server: {
            type: 'string',
            shortFlag: 's',
            default: 'http://localhost:3000'
        }
    }
});

// Configuration
const SERVER_URL = cli.flags.server || 'http://localhost:3000';
const SECRET_KEY = 'supersecretkey';
const PROGRAM_NAME = 'mgba';

// Game input types
const GAME_INPUTS = [
    'up', 'down', 'left', 'right',
    'a', 'b', 'start', 'select'
] as const;

type GameInputType = typeof GAME_INPUTS[number];



// Global state
let messageQueue: string[] = [];



// Send key to mgba (ydotool sends to focused window)
function sendKeyToMgba(command: string): void {
    sendKey(command);
}

// Get next input from queue
function getNextInput(): string | null {
    if (messageQueue.length === 0) {
        return null;
    }

    // Pop the first message from the queue
    return messageQueue.shift() || null;
}

// Send input every 5 seconds
function startInputSender(): void {
    setInterval(() => {
        const input = getNextInput();
        if (input) {
            console.log(`Processing input: ${input} (${messageQueue.length} remaining in queue)`);
            sendKeyToMgba(input);
        }
    }, 5000);
}

// WebSocket connection
function connectWebSocket(): void {
    const wsUrl = SERVER_URL.replace('http://', 'ws://').replace('https://', 'wss://') + '/socket';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('Connected to server');

        // Authenticate
        ws.send(JSON.stringify({
            type: 'auth',
            data: { secretKey: SECRET_KEY }
        }));

        // Join
        ws.send(JSON.stringify({
            type: 'join'
        }));

        // Get existing messages
        ws.send(JSON.stringify({
            type: 'get_messages'
        }));
    };

    ws.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case 'auth_status':
                    if (message.data.authenticated) {
                        console.log('Authenticated successfully');
                    } else {
                        console.log('Authentication failed');
                    }
                    break;

                case 'input':
                    const input = message.data.input;
                    if (GAME_INPUTS.includes(input)) {
                        messageQueue.push(input);
                        console.log(`New input received: ${input} (queue size: ${messageQueue.length})`);
                    }
                    break;

                case 'messages':
                    const messages = message.data;
                    messageQueue = [];
                    for (const msg of messages) {
                        if (GAME_INPUTS.includes(msg.input)) {
                            messageQueue.push(msg.input);
                        }
                    }
                    console.log(`Loaded ${messageQueue.length} existing messages`);
                    break;

                case 'user_count':
                    console.log(`Users connected: ${message.data.count}`);
                    break;

                default:
                    console.log('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    ws.onclose = () => {
        console.log('Connection closed, attempting to reconnect...');
        setTimeout(() => connectWebSocket(), 5000);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

// Main function
async function main(): Promise<void> {
    console.log('CrowdPad CLI starting...');
    console.log(`Server: ${SERVER_URL}`);

    try {
        // Check if mGBA HTTP server is running
        if (!(await checkMgbaServerRunning())) {
            console.error('Error: mGBA HTTP server is not running.');
            console.error('Setup instructions:');
            console.error('1. Start mGBA with the mGBASocketServer.lua script');
            console.error('2. Make sure the server is listening on port 8888');
            process.exit(1);
        }


        // Connect to WebSocket
        connectWebSocket();

        // Start sending inputs every 5 seconds
        startInputSender();

        console.log('CLI is running. Press Ctrl+C to stop.');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down...');
    closePersistentSocket();
    process.exit(0);
});

main().catch(console.error);
