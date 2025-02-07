import { vi } from 'vitest';
import { Scope } from '../components/scope';
export class PopoverSuggest {
    constructor(app, scope) {
        this.open = vi.fn(() => { });
        this.close = vi.fn(() => { });
        this.app = app;
        this.scope = scope || new Scope();
    }
}
export class AbstractInputSuggest extends PopoverSuggest {
    constructor(app, textInputEl) {
        super(app);
        this.limit = 100;
        this.onSelectCallback = null;
        this.setValue = vi.fn((value) => {
            if (this.textInputEl instanceof HTMLInputElement) {
                this.textInputEl.value = value;
            }
            else {
                this.textInputEl.textContent = value;
            }
        });
        this.getValue = vi.fn(() => {
            return this.textInputEl instanceof HTMLInputElement
                ? this.textInputEl.value
                : this.textInputEl.textContent || '';
        });
        this.selectSuggestion = vi.fn((value, evt) => {
            this.onSelectCallback?.(value, evt);
        });
        this.onSelect = vi.fn((callback) => {
            this.onSelectCallback = callback;
            return this;
        });
        this.textInputEl = textInputEl;
    }
}
