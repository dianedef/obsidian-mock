import { vi } from 'vitest';
import type { SearchComponent } from 'obsidian';

export class MockSearchComponent implements SearchComponent {
    inputEl: HTMLInputElement;
    clearButtonEl: HTMLElement;
    disabled: boolean = false;
    private onChangeCallback: ((value: string) => any) | null = null;

    constructor(containerEl: HTMLElement) {
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'search';
        this.inputEl.addClass('search-input');
        containerEl.appendChild(this.inputEl);

        this.clearButtonEl = document.createElement('button');
        this.clearButtonEl.addClass('search-clear-button');
        this.clearButtonEl.setAttribute('aria-label', 'Clear search');
        containerEl.appendChild(this.clearButtonEl);

        this.inputEl.addEventListener('input', () => {
            this.onChanged();
        });

        this.clearButtonEl.addEventListener('click', () => {
            this.clear();
        });
    }

    getValue = vi.fn().mockImplementation((): string => {
        return this.inputEl.value;
    });

    setValue = vi.fn().mockImplementation((value: string): this => {
        this.inputEl.value = value;
        this.onChanged();
        return this;
    });

    setPlaceholder = vi.fn().mockImplementation((placeholder: string): this => {
        this.inputEl.placeholder = placeholder;
        return this;
    });

    onChanged = vi.fn().mockImplementation((): void => {
        const value = this.getValue();
        this.onChangeCallback?.(value);
        this.clearButtonEl.style.display = value ? 'block' : 'none';
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