import { vi } from 'vitest';
import type { App, Instruction } from 'obsidian';
import { Modal } from './modal';
import { MockSuggestOwner } from '../components/suggest-owner';

/**
 * @public
 */
export abstract class SuggestModal<T> extends Modal {
    private suggestOwner: MockSuggestOwner<T>;

    /**
     * @public
     */
    constructor(app: App) {
        super(app);
        this.suggestOwner = new MockSuggestOwner<T>();
        
        // Création des éléments DOM
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
        this.inputEl.placeholder = '';
        
        this.resultContainerEl = document.createElement('div');
        this.resultContainerEl.className = 'suggestion-container';
        
        this.contentEl.appendChild(this.inputEl);
        this.contentEl.appendChild(this.resultContainerEl);
    }

    get limit(): number { return this.suggestOwner.limit; }
    set limit(value: number) { this.suggestOwner.limit = value; }

    get emptyStateText(): string { return this.suggestOwner.emptyStateText; }
    set emptyStateText(value: string) { this.suggestOwner.emptyStateText = value; }

    get inputEl(): HTMLInputElement { return this.suggestOwner.inputEl; }
    set inputEl(value: HTMLInputElement) { this.suggestOwner.inputEl = value; }

    get resultContainerEl(): HTMLElement { return this.suggestOwner.resultContainerEl; }
    set resultContainerEl(value: HTMLElement) { this.suggestOwner.resultContainerEl = value; }

    setPlaceholder = vi.fn().mockImplementation((placeholder: string): void => {
        this.suggestOwner.setPlaceholder(placeholder);
    });

    setInstructions = vi.fn().mockImplementation((instructions: Instruction[]): void => {
        this.suggestOwner.setInstructions(instructions);
    });

    onNoSuggestion = vi.fn().mockImplementation((): void => {
        this.suggestOwner.onNoSuggestion();
    });

    selectSuggestion = vi.fn().mockImplementation((value: T, evt: MouseEvent | KeyboardEvent): void => {
        this.suggestOwner.selectSuggestion(value, evt);
        this.close();
    });

    selectActiveSuggestion = vi.fn().mockImplementation((evt: MouseEvent | KeyboardEvent): void => {
        this.suggestOwner.selectActiveSuggestion(evt);
    });

    abstract getSuggestions(query: string): T[] | Promise<T[]>;
    abstract renderSuggestion(value: T, el: HTMLElement): void;
    abstract onChooseSuggestion(item: T, evt: MouseEvent | KeyboardEvent): void;
} 