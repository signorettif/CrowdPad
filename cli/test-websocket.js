#!/usr/bin/env node

const WebSocket = require('ws');

const MGBA_HOST = 'localhost';
const MGBA_PORT = 8889;
const TERMINATION_MARKER = '<|END|>';

function testWebSocketConnection() {
    console.log(`Testing WebSocket connection to ws://${MGBA_HOST}:${MGBA_PORT}`);
    
    const socket = new WebSocket(`ws://${MGBA_HOST}:${MGBA_PORT}`);
    
    socket.onopen = () => {
        console.log('✓ WebSocket connection opened');
        
        // Send a test message
        const testMessage = 'mgba-http.button.tap,A';
        console.log(`Sending test message: ${testMessage}`);
        socket.send(testMessage + TERMINATION_MARKER);
    };
    
    socket.onmessage = (event) => {
        console.log('✓ Received response:', event.data);
        socket.close();
    };
    
    socket.onerror = (error) => {
        console.error('✗ WebSocket error:', error);
        socket.close();
    };
    
    socket.onclose = (event) => {
        console.log(`WebSocket closed with code: ${event.code}`);
        if (event.code !== 1000) {
            console.log('Connection closed unexpectedly');
        }
    };
    
    // Set timeout to prevent hanging
    setTimeout(() => {
        if (socket.readyState === WebSocket.CONNECTING) {
            console.log('✗ Connection timeout - server might not be running');
            socket.close();
        }
    }, 5000);
}

function testRawSocketConnection() {
    console.log(`Testing raw socket connection to ${MGBA_HOST}:${MGBA_PORT}`);
    
    const net = require('net');
    const socket = new net.Socket();
    
    socket.setTimeout(5000);
    
    socket.connect(MGBA_PORT, MGBA_HOST, () => {
        console.log('✓ Raw socket connection established');
        
        // Send a test message
        const testMessage = 'mgba-http.button.tap,A';
        console.log(`Sending test message: ${testMessage}`);
        socket.write(testMessage + TERMINATION_MARKER);
    });
    
    socket.on('data', (data) => {
        console.log('✓ Received response:', data.toString());
        socket.end();
    });
    
    socket.on('timeout', () => {
        console.log('✗ Raw socket timeout - server might not be running');
        socket.destroy();
    });
    
    socket.on('error', (err) => {
        console.error('✗ Raw socket error:', err.message);
        socket.destroy();
    });
    
    socket.on('close', () => {
        console.log('Raw socket closed');
    });
}

console.log('=== mGBA WebSocket Server Test ===\n');

// Test WebSocket connection first
testWebSocketConnection();

// Wait a bit, then test raw socket
setTimeout(() => {
    console.log('\n=== Testing Raw Socket Connection ===\n');
    testRawSocketConnection();
}, 6000);
