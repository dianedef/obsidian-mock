import { vi } from 'vitest';
import { Modal } from './modal';
import { MockSuggestOwner } from '../components/suggest-owner';
/**
 * @public
 */
export class SuggestModal extends Modal {
    /**
     * @public
     */
    constructor(app) {
        super(app);
        this.setPlaceholder = vi.fn().mockImplementation((placeholder) => {
            this.suggestOwner.setPlaceholder(placeholder);
        });
        this.setInstructions = vi.fn().mockImplementation((instructions) => {
            this.suggestOwner.setInstructions(instructions);
        });
        this.onNoSuggestion = vi.fn().mockImplementation(() => {
            this.suggestOwner.onNoSuggestion();
        });
        this.selectSuggestion = vi.fn().mockImplementation((value, evt) => {
            this.suggestOwner.selectSuggestion(value, evt);
            this.close();
        });
        this.selectActiveSuggestion = vi.fn().mockImplementation((evt) => {
            this.suggestOwner.selectActiveSuggestion(evt);
        });
        this.suggestOwner = new MockSuggestOwner();
        // Création des éléments DOM
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
        this.inputEl.placeholder = '';
        this.resultContainerEl = document.createElement('div');
        this.resultContainerEl.className = 'suggestion-container';
        this.contentEl.appendChild(this.inputEl);
        this.contentEl.appendChild(this.resultContainerEl);
    }
    get limit() { return this.suggestOwner.limit; }
    set limit(value) { this.suggestOwner.limit = value; }
    get emptyStateText() { return this.suggestOwner.emptyStateText; }
    set emptyStateText(value) { this.suggestOwner.emptyStateText = value; }
    get inputEl() { return this.suggestOwner.inputEl; }
    set inputEl(value) { this.suggestOwner.inputEl = value; }
    get resultContainerEl() { return this.suggestOwner.resultContainerEl; }
    set resultContainerEl(value) { this.suggestOwner.resultContainerEl = value; }
}
