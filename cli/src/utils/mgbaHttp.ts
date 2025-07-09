// Socket client utilities for sending keys to mGBA via mGBASocketServer.lua

import { Socket } from 'net';

const MGBA_HOST = 'localhost';
const MGBA_PORT = 8889;
const TERMINATION_MARKER = '<|END|>';

// Key mapping for mGBA (socket server interface)
const keyMap: Record<string, string> = {
    up: 'Up',
    left: 'Left',
    down: 'Down',
    right: 'Right',
    a: 'A',
    b: 'B',
    start: 'Start',
    select: 'Select'
};

// Module-level persistent socket connection
let persistentSocket: Socket | null = null;
let isConnecting = false;
let pendingRequests: Array<{
    message: string;
    resolve: (value: string) => void;
    reject: (error: Error) => void;
}> = [];

/**
 * Get or create a persistent socket connection
 */
async function maybeGetSocket(): Promise<Socket> {
    if (persistentSocket && persistentSocket.readyState === 'open') {
        return persistentSocket;
    }

    if (isConnecting) {
        // Wait for existing connection attempt
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                if (!isConnecting) {
                    clearInterval(checkInterval);
                    if (persistentSocket && persistentSocket.readyState === 'open') {
                        resolve(persistentSocket);
                    } else {
                        reject(new Error('Connection failed'));
                    }
                }
            }, 50);
        });
    }

    return new Promise((resolve, reject) => {
        isConnecting = true;
        
        const socket = new Socket();
        let responseBuffer = '';
        
        socket.setTimeout(5000);
        
        socket.connect(MGBA_PORT, MGBA_HOST, () => {
            persistentSocket = socket;
            isConnecting = false;
            console.log('Connected to mGBA server');
            resolve(socket);
        });
        
        socket.on('data', (data: Buffer) => {
            responseBuffer += data.toString();
            
            // Process complete messages
            while (responseBuffer.includes(TERMINATION_MARKER)) {
                const markerIndex = responseBuffer.indexOf(TERMINATION_MARKER);
                const response = responseBuffer.slice(0, markerIndex);
                responseBuffer = responseBuffer.slice(markerIndex + TERMINATION_MARKER.length);
                
                // Find and resolve the first pending request
                const request = pendingRequests.shift();
                if (request) {
                    request.resolve(response);
                }
            }
        });
        
        socket.on('timeout', () => {
            socket.destroy();
            persistentSocket = null;
            isConnecting = false;
            reject(new Error('Socket timeout'));
        });
        
        socket.on('error', (error: Error) => {
            socket.destroy();
            persistentSocket = null;
            isConnecting = false;
            console.error('Socket error:', error);
            reject(error);
        });
        
        socket.on('close', () => {
            persistentSocket = null;
            isConnecting = false;
            console.log('Socket closed');
            
            // Reject all pending requests
            pendingRequests.forEach(request => {
                request.reject(new Error('Socket closed'));
            });
            pendingRequests = [];
        });
    });
}

/**
 * Check if the mGBA socket server is running
 */
export async function checkMgbaServerRunning(): Promise<boolean> {
    try {
        await maybeGetSocket();
        return true;
    } catch {
        return false;
    }
}

/**
 * Send a message to the mGBA socket server and get response
 */
async function sendSocketMessage(message: string): Promise<string> {
    const socket = await maybeGetSocket();
    
    return new Promise((resolve, reject) => {
        // Add to pending requests queue
        pendingRequests.push({ message, resolve, reject });
        
        // Send the message
        socket.write(message + TERMINATION_MARKER);
        
        // Set timeout for this specific request
        setTimeout(() => {
            const requestIndex = pendingRequests.findIndex(req => req.message === message);
            if (requestIndex !== -1) {
                const request = pendingRequests.splice(requestIndex, 1)[0];
                request.reject(new Error('Request timeout'));
            }
        }, 5000);
    });
}

/**
 * Send a key tap to mGBA via socket server
 */
export async function sendKey(command: string): Promise<void> {
    const mgbaKey = keyMap[command] || command;
    
    try {
        const message = `mgba-http.button.tap,${mgbaKey}`;
        const response = await sendSocketMessage(message);
        
        if (response === '<|SUCCESS|>') {
            console.log(`Sent key: ${command} (${mgbaKey})`);
        } else {
            console.error(`Unexpected response: ${response}`);
        }
    } catch (error) {
        console.error(`Error sending key: ${error}`);
    }
}


/**
 * Close the persistent socket connection
 */
export function closePersistentSocket(): void {
    if (persistentSocket) {
        persistentSocket.end();
        persistentSocket = null;
    }
}
