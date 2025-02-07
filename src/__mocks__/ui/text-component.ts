import { vi } from 'vitest';
import type { TextComponent as ITextComponent, TextAreaComponent as ITextAreaComponent } from 'obsidian';
import { BaseComponent } from '../components/component';
import { Events } from '../components/events';

export class TextComponent extends Events implements ITextComponent {
    inputEl: HTMLInputElement;
    disabled: boolean = false;

    constructor(containerEl: HTMLElement) {
        super();
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
        containerEl.appendChild(this.inputEl);
        this.inputEl.addEventListener('input', this.onChanged.bind(this));
    }

    getValue(): string {
        return this.inputEl.value;
    }

    setValue(value: string): this {
        this.inputEl.value = value;
        return this;
    }

    setPlaceholder(placeholder: string): this {
        this.inputEl.placeholder = placeholder;
        return this;
    }

    onChanged(): void {
        const value = this.getValue();
        this.trigger('change', value);
    }

    onChange(callback: (value: string) => any): this {
        this.on('change', callback);
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        this.inputEl.disabled = disabled;
        return this;
    }

    then(cb: (component: this) => any): this {
        cb(this);
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
        this.on('change', () => {
            const value = this.getValue();
            if (listeners[key]) {
                listeners[key](value);
            }
        });
        return this;
    }
}

export class TextAreaComponent extends Events implements ITextAreaComponent {
    inputEl: HTMLTextAreaElement;
    disabled: boolean = false;

    constructor(containerEl: HTMLElement) {
        super();
        this.inputEl = document.createElement('textarea');
        containerEl.appendChild(this.inputEl);
        this.inputEl.addEventListener('input', this.onChanged.bind(this));
    }

    getValue(): string {
        return this.inputEl.value;
    }

    setValue(value: string): this {
        this.inputEl.value = value;
        return this;
    }

    setPlaceholder(placeholder: string): this {
        this.inputEl.placeholder = placeholder;
        return this;
    }

    onChanged(): void {
        const value = this.getValue();
        this.trigger('change', value);
    }

    onChange(callback: (value: string) => any): this {
        this.on('change', callback);
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        this.inputEl.disabled = disabled;
        return this;
    }

    then(cb: (component: this) => any): this {
        cb(this);
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
        this.on('change', () => {
            const value = this.getValue();
            if (listeners[key]) {
                listeners[key](value);
            }
        });
        return this;
    }
} 