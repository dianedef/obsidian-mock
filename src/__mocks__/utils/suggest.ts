import { vi } from 'vitest';
import type { App, ISuggestOwner, CloseableComponent } from 'obsidian';
import { Scope } from '../components/scope';

export abstract class PopoverSuggest<T> implements ISuggestOwner<T>, CloseableComponent {
    app: App;
    scope: Scope;

    constructor(app: App, scope?: Scope) {
        this.app = app;
        this.scope = scope || new Scope();
    }

    open = vi.fn((): void => {});
    close = vi.fn((): void => {});
    abstract renderSuggestion(value: T, el: HTMLElement): void;
    abstract selectSuggestion(value: T, evt: MouseEvent | KeyboardEvent): void;
}

export abstract class AbstractInputSuggest<T> extends PopoverSuggest<T> {
    limit: number = 100;
    private textInputEl: HTMLInputElement | HTMLDivElement;
    private onSelectCallback: ((value: T, evt: MouseEvent | KeyboardEvent) => any) | null = null;

    constructor(app: App, textInputEl: HTMLInputElement | HTMLDivElement) {
        super(app);
        this.textInputEl = textInputEl;
    }

    setValue = vi.fn((value: string): void => {
        if (this.textInputEl instanceof HTMLInputElement) {
            this.textInputEl.value = value;
        } else {
            this.textInputEl.textContent = value;
        }
    });

    getValue = vi.fn((): string => {
        return this.textInputEl instanceof HTMLInputElement 
            ? this.textInputEl.value 
            : this.textInputEl.textContent || '';
    });

    protected abstract getSuggestions(query: string): T[] | Promise<T[]>;
    abstract renderSuggestion(value: T, el: HTMLElement): void;

    selectSuggestion = vi.fn((value: T, evt: MouseEvent | KeyboardEvent): void => {
        this.onSelectCallback?.(value, evt);
    });

    onSelect = vi.fn((callback: (value: T, evt: MouseEvent | KeyboardEvent) => any): this => {
        this.onSelectCallback = callback;
        return this;
    });
} 