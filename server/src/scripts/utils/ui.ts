/**
 * UI utility functions for DOM manipulation and message handling
 */

export class UIUtils {
    /**
     * Create a message element for the chat interface
     */
    static createMessageElement(username: string, input: string, timestamp: number): HTMLElement {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'mb-2 p-2 bg-white rounded border-l-4 border-blue-500';
        
        const time = new Date(timestamp).toLocaleTimeString();
        messageDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="font-semibold text-blue-600">${this.escapeHtml(username)}</span>
                <span class="text-xs text-gray-500">${time}</span>
            </div>
            <div class="text-sm text-gray-700">Pressed: <span class="font-mono bg-gray-100 px-1 rounded">${input.toUpperCase()}</span></div>
        `;
        
        return messageDiv;
    }

    /**
     * Clear all messages from a container element
     */
    static clearMessages(container: HTMLElement): void {
        container.innerHTML = '';
    }

    /**
     * Add a message to the chat container
     */
    static addMessageToContainer(container: HTMLElement, username: string, input: string, timestamp: number): void {
        // Remove placeholder text if present
        if (container.firstChild && container.firstChild.textContent?.includes('Messages will appear here')) {
            container.innerHTML = '';
        }
        
        const messageElement = this.createMessageElement(username, input, timestamp);
        container.appendChild(messageElement);
        container.scrollTop = container.scrollHeight;
    }

    /**
     * Disable buttons with visual feedback
     */
    static disableButtons(buttons: NodeListOf<HTMLElement>, duration: number): void {
        buttons.forEach(button => {
            (button as HTMLButtonElement).disabled = true;
            (button as HTMLElement).style.opacity = '0.5';
        });
        
        setTimeout(() => {
            buttons.forEach(button => {
                (button as HTMLButtonElement).disabled = false;
                (button as HTMLElement).style.opacity = '1';
            });
        }, duration);
    }

    /**
     * Escape HTML to prevent XSS
     */
    private static escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Validate username input
     */
    static validateUsername(username: string): { isValid: boolean; message?: string } {
        if (!username || !username.trim()) {
            return { isValid: false, message: 'Please enter a username first!' };
        }
        
        if (username.length > 20) {
            return { isValid: false, message: 'Username must be 20 characters or less!' };
        }
        
        return { isValid: true };
    }

    /**
     * Show user-friendly alerts
     */
    static showAlert(message: string): void {
        alert(message);
    }

    /**
     * Focus on an input element
     */
    static focusElement(element: HTMLElement): void {
        element.focus();
    }
}
