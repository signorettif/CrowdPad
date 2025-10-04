/**
 * This is the code that handles submissions from the main index.html page
 */

import { WebSocketService } from '../utils/websockets/service.js';
import { UIUtils } from './utils/ui.js';
import { INPUT_COOLDOWN } from '../constants.js';

import type { GameInput, ServerMessage } from '../types/shared.js';

class GameController {
    private usernameInput: HTMLInputElement;
    private secretKeyInput: HTMLInputElement;
    private authenticateButton: HTMLButtonElement;
    private authStatus: HTMLElement;
    private chatMessages: HTMLElement;
    private onlineCount: HTMLElement;
    private buttons: NodeListOf<HTMLElement>;
    private wsService: WebSocketService;
    private lastInputTime: number = 0;
    private isAuthenticated: boolean = false;

    constructor() {
        this.usernameInput = document.getElementById('username') as HTMLInputElement;
        this.secretKeyInput = document.getElementById('secretKey') as HTMLInputElement;
        this.authenticateButton = document.getElementById('authenticate') as HTMLButtonElement;
        this.authStatus = document.getElementById('auth-status') as HTMLElement;
        this.chatMessages = document.getElementById('chat-messages') as HTMLElement;
        this.onlineCount = document.getElementById('online-count') as HTMLElement;
        this.buttons = document.querySelectorAll('[data-input]') as NodeListOf<HTMLElement>;
        
        this.initializeWebSocket();
        this.attachEventListeners();
        this.disableGameControls();
    }

    private initializeWebSocket(): void {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        this.wsService = new WebSocketService(`${protocol}//${window.location.host}/socket`);
        
        this.wsService.onOpen(() => {
            this.wsService.send({ type: 'join' });
        });
        
        this.wsService.onMessage((message: ServerMessage) => {
            switch (message.type) {
                case 'auth_status':
                    this.handleAuthStatus(message.data);
                    break;
                case 'input':
                    UIUtils.addMessageToContainer(
                        this.chatMessages,
                        message.data.username,
                        message.data.input,
                        message.data.timestamp
                    );
                    break;
                case 'messages':
                    UIUtils.clearMessages(this.chatMessages);
                    message.data.forEach((msg: GameInput) => {
                        UIUtils.addMessageToContainer(
                            this.chatMessages,
                            msg.username,
                            msg.input,
                            msg.timestamp
                        );
                    });
                    break;
                case 'user_count':
                    this.onlineCount.textContent = message.data.count.toString();
                    break;
            }
        });
    }

    private handleAuthStatus(data: any): void {
        if (data.authenticated) {
            this.isAuthenticated = true;
            this.authStatus.textContent = 'Authenticated successfully!';
            this.authStatus.className = 'mt-2 text-sm text-center text-green-600';
            this.enableGameControls();
            this.wsService.send({ type: 'get_messages' });
        } else {
            this.isAuthenticated = false;
            this.authStatus.textContent = 'Authentication failed. Please check your secret key.';
            this.authStatus.className = 'mt-2 text-sm text-center text-red-600';
            this.disableGameControls();
        }
    }

    private disableGameControls(): void {
        this.buttons.forEach(button => {
            button.setAttribute('disabled', 'true');
            button.classList.add('opacity-50', 'cursor-not-allowed');
        });
    }

    private enableGameControls(): void {
        this.buttons.forEach(button => {
            button.removeAttribute('disabled');
            button.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    }

    private attachEventListeners(): void {
        // Authentication button listener
        this.authenticateButton.addEventListener('click', () => {
            const secretKey = this.secretKeyInput.value.trim();
            if (!secretKey) {
                UIUtils.showAlert('Please enter a secret key');
                return;
            }
            
            this.wsService.send({
                type: 'auth',
                data: { secretKey }
            });
        });

        // Game controller buttons
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (!this.isAuthenticated) {
                    UIUtils.showAlert('Please authenticate first');
                    return;
                }
                
                const username = this.usernameInput.value.trim();
                const input = button.getAttribute('data-input');
                const currentTime = Date.now();
                
                // Validate username
                const validation = UIUtils.validateUsername(username);
                if (!validation.isValid) {
                    UIUtils.showAlert(validation.message!);
                    UIUtils.focusElement(this.usernameInput);
                    return;
                }
                
                // Check rate limiting
                if (currentTime - this.lastInputTime < INPUT_COOLDOWN) {
                    const remainingTime = Math.ceil((INPUT_COOLDOWN - (currentTime - this.lastInputTime)) / 1000);
                    UIUtils.showAlert(`Please wait ${remainingTime} seconds before sending another input.`);
                    return;
                }
                
                // Update last input time and disable buttons temporarily
                this.lastInputTime = currentTime;
                UIUtils.disableButtons(this.buttons, INPUT_COOLDOWN);
                
                // Send input to server (timestamp added server-side)
                this.wsService.send({
                    type: 'input',
                    data: { username, input }
                });
            });
        });
    }
}

// Initialize the game controller when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});
