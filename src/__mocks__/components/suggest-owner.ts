import { vi } from 'vitest';
import type { ISuggestOwner, Instruction } from 'obsidian';

export class MockSuggestOwner<T> implements ISuggestOwner<T> {
    limit = 50;
    emptyStateText = 'No suggestions';
    inputEl: HTMLInputElement = document.createElement('input');
    resultContainerEl: HTMLElement = document.createElement('div');

    setPlaceholder = vi.fn().mockImplementation((placeholder: string): void => {
        this.inputEl.placeholder = placeholder;
    });

    setInstructions = vi.fn().mockImplementation((instructions: Instruction[]): void => {
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

    onNoSuggestion = vi.fn();
    selectSuggestion = vi.fn();
    selectActiveSuggestion = vi.fn();
    getSuggestions = vi.fn();
    renderSuggestion = vi.fn();
    onChooseSuggestion = vi.fn();
} 