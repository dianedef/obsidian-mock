import type { App, CloseableComponent, ISuggestOwner, Scope } from 'obsidian';
import { vi } from 'vitest';

export enum PopoverState {
    Closed = 'closed',
    Open = 'open',
    Loading = 'loading'
}

export abstract class MockPopoverSuggest<T> implements ISuggestOwner<T>, CloseableComponent {
    app: App;
    scope: Scope;
    suggestEl: HTMLElement;
    isOpen: boolean = false;
    state: PopoverState = PopoverState.Closed;

    constructor(app: App, scope?: Scope) {
        this.app = app;
        this.scope = scope || {
            register: vi.fn(),
            unregister: vi.fn()
        };
        this.suggestEl = document.createElement('div');
        this.suggestEl.addClass('suggestion-container');
    }

    open(): void {
        if (!this.isOpen) {
            document.body.appendChild(this.suggestEl);
            this.isOpen = true;
            this.state = PopoverState.Open;
        }
    }

    close(): void {
        if (this.isOpen) {
            this.suggestEl.detach();
            this.isOpen = false;
            this.state = PopoverState.Closed;
        }
    }

    abstract renderSuggestion(value: T, el: HTMLElement): void;
    abstract selectSuggestion(value: T, evt: MouseEvent | KeyboardEvent): void;
} 