import { vi } from 'vitest';
export class MockSuggestOwner {
    constructor() {
        this.limit = 50;
        this.emptyStateText = 'No suggestions';
        this.inputEl = document.createElement('input');
        this.resultContainerEl = document.createElement('div');
        this.setPlaceholder = vi.fn().mockImplementation((placeholder) => {
            this.inputEl.placeholder = placeholder;
        });
        this.setInstructions = vi.fn().mockImplementation((instructions) => {
            // Implémentation de base pour les instructions
            const instructionsEl = document.createElement('div');
            instructionsEl.className = 'prompt-instructions';
            instructions.forEach(instruction => {
                const div = document.createElement('div');
                div.className = 'prompt-instruction';
                const command = document.createElement('span');
                command.className = 'prompt-instruction-command';
                command.textContent = instruction.command;
                div.appendChild(command);
                const purpose = document.createElement('span');
                purpose.className = 'prompt-instruction-purpose';
                purpose.textContent = instruction.purpose;
                div.appendChild(purpose);
                instructionsEl.appendChild(div);
            });
        });
        this.onNoSuggestion = vi.fn();
        this.selectSuggestion = vi.fn();
        this.selectActiveSuggestion = vi.fn();
        this.getSuggestions = vi.fn();
        this.renderSuggestion = vi.fn();
        this.onChooseSuggestion = vi.fn();
    }
}
