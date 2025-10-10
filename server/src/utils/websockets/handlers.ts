import { getInputCommanddown } from '../../constants';

import type { ClientMessage } from '../../types/shared';
import type { ServerMessage } from '../../types/serverMessages';

export class WebSocketHandlers {
  private connectedUsers = new Set<any>();
  private authenticatedUsers = new Set<any>();
  private userLastInputTime = new Map<string, number>();
  private aggregationInterval: number;

  handleMessage(ws: any, message: string): void {
    try {
      const clientMessage: ClientMessage = JSON.parse(message);

      switch (clientMessage.type) {
        case 'auth':
          this.handleAuthMessage(ws, clientMessage);
          break;
        case 'input':
          this.handleInputMessage(ws, clientMessage);
          break;
        case 'join':
          this.handleJoinMessage(ws);
          break;
        case 'move_executed':
          this.handleMoveExecutedMessage(ws, clientMessage);
          break;
        default:
          console.warn('Unknown message type:', clientMessage.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  handleOpen(ws: any): void {
    this.connectedUsers.add(ws);

    // Send current user count to all clients
    this.broadcastUserCount();

    console.log(`New connection. Total users: ${this.connectedUsers.size}`);
  }

  handleClose(ws: any): void {
    this.connectedUsers.delete(ws);
    this.authenticatedUsers.delete(ws);

    // Send updated user count to remaining clients
    this.broadcastUserCount();

    console.log(`Connection closed. Total users: ${this.connectedUsers.size}`);
  }

  private handleAuthMessage(ws: any, clientMessage: ClientMessage): void {
    const { secretKey, aggregationInterval } = clientMessage.data || {};
    const expectedSecretKey = process.env.WEBSOCKET_SECRET_KEY;

    if (!expectedSecretKey) {
      console.warn('WEBSOCKET_SECRET_KEY not configured');
      this.sendMessage(ws, {
        type: 'auth_status',
        data: { authenticated: false },
      });
      return;
    }

    if (secretKey === expectedSecretKey) {
      this.authenticatedUsers.add(ws);

      // aggregationInterval will be sent by the CLI
      if (aggregationInterval && typeof aggregationInterval === 'number') {
        this.aggregationInterval = aggregationInterval;
        console.log(`Aggregation interval set to: ${aggregationInterval}ms`);
      }

      this.sendMessage(ws, {
        type: 'auth_status',
        data: {
          authenticated: true,
          aggregationInterval: this.aggregationInterval,
        },
      });
      console.log('User authenticated successfully');
    } else {
      this.sendMessage(ws, {
        type: 'auth_status',
        data: { authenticated: false },
      });
      console.log('Authentication failed');
    }
  }

  private handleInputMessage(ws: any, clientMessage: ClientMessage): void {
    // Check if user is authenticated
    if (!this.authenticatedUsers.has(ws)) {
      console.log('Input rejected: User not authenticated');
      return;
    }

    // Validate username is provided
    if (!clientMessage.data?.username || !clientMessage.data.username.trim()) {
      console.log('Input rejected: No username provided');
      return;
    }

    const username = clientMessage.data.username.trim();
    const currentTime = Date.now();
    const lastInputTime = this.userLastInputTime.get(username) || 0;

    // Check rate limiting
    if (currentTime - lastInputTime < getInputCommanddown()) {
      console.log(`Input rejected: User ${username} rate limited`);
      return;
    }

    // Update last input time
    this.userLastInputTime.set(username, currentTime);

    // Broadcast to all connected users (including sender)
    const inputMessage: ServerMessage = {
      type: 'input',
      data: {
        username: username,
        input: clientMessage.data.input,
        timestamp: currentTime,
      },
    };

    this.broadcastMessage(inputMessage);
    console.log(
      `timestamp: ${currentTime}, user: ${username}, input: ${clientMessage.data.input}`
    );
  }

  private handleJoinMessage(ws: any): void {
    const userCountMessage: ServerMessage = {
      type: 'user_count',
      data: { count: this.connectedUsers.size },
    };
    this.sendMessage(ws, userCountMessage);
  }

  private handleMoveExecutedMessage(
    ws: any,
    clientMessage: ClientMessage
  ): void {
    // Check if user is authenticated (CLI should be authenticated)
    if (!this.authenticatedUsers.has(ws)) {
      console.log('Move executed message rejected: User not authenticated');
      return;
    }

    // Broadcast the move execution to all connected clients
    const moveExecutedMessage: ServerMessage = {
      type: 'move_executed',
      data: {
        chosenCommand: clientMessage.data?.chosenCommand,
        voteCounts: clientMessage.data?.voteCounts,
        windowStart: clientMessage.data?.windowStart,
        windowEnd: clientMessage.data?.windowEnd,
        timestamp: clientMessage.data?.timestamp,
      },
    };

    this.broadcastMessage(moveExecutedMessage);
    console.log(
      `Move executed broadcast: ${clientMessage.data?.chosenCommand} with votes:`,
      clientMessage.data?.voteCounts
    );
  }

  private broadcastUserCount(): void {
    const userCountMessage: ServerMessage = {
      type: 'user_count',
      data: { count: this.connectedUsers.size },
    };
    this.broadcastMessage(userCountMessage);
  }

  private broadcastMessage(message: ServerMessage): void {
    this.connectedUsers.forEach((client) => {
      this.sendMessage(client, message);
    });
  }

  private sendMessage(ws: any, message: ServerMessage): void {
    try {
      ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
