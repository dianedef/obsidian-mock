import { vi } from 'vitest';
import type { SearchComponent as ISearchComponent } from 'obsidian';
import { Component } from './component';

export class SearchComponent extends Component implements ISearchComponent {
    containerEl: HTMLElement = document.createElement('div');
    inputEl: HTMLInputElement = document.createElement('input');
    clearButtonEl: HTMLElement;
    disabled: boolean = false;
    private onChangeCallback: ((value: string) => any) | null = null;

    constructor() {
        super();
        this.inputEl.type = 'search';
        this.inputEl.addClass('search-input');
        this.containerEl.appendChild(this.inputEl);

        this.clearButtonEl = document.createElement('button');
        this.clearButtonEl.addClass('search-clear-button');
        this.clearButtonEl.setAttribute('aria-label', 'Clear search');
        this.containerEl.appendChild(this.clearButtonEl);

        this.inputEl.addEventListener('input', () => {
            this.onChanged();
        });

        this.clearButtonEl.addEventListener('click', () => {
            this.clear();
        });
    }

    getValue = vi.fn().mockReturnValue('');
    setValue = vi.fn();
    onChanged = vi.fn();

    setPlaceholder = vi.fn().mockImplementation((placeholder: string): this => {
        this.inputEl.placeholder = placeholder;
        return this;
    });

    onChange = vi.fn().mockImplementation((callback: (value: string) => any): this => {
        this.onChangeCallback = callback;
        return this;
    });

    clear = vi.fn().mockImplementation((): void => {
        this.setValue('');
    });

    setDisabled = vi.fn().mockImplementation((disabled: boolean): this => {
        this.disabled = disabled;
        this.inputEl.disabled = disabled;
        return this;
    });

    registerOptionListener = vi.fn().mockImplementation((listeners: Record<string, (value?: string) => string>, key: string): this => {
        const listener = listeners[key];
        if (listener) {
            this.onChange((value: string) => {
                const newValue = listener(value);
                if (newValue !== undefined) {
                    this.setValue(newValue);
                }
            });
        }
        return this;
    });

    then = vi.fn().mockImplementation((cb: (component: this) => any): this => {
        cb(this);
        return this;
    });
} 