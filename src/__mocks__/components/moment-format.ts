import { vi } from 'vitest';
import type { TextComponent } from 'obsidian';
import { MockComponent } from './component';

export class MockMomentFormatComponent extends MockComponent implements TextComponent {
    inputEl: HTMLInputElement;
    sampleEl: HTMLElement;
    disabled: boolean = false;
    private defaultFormat: string = 'YYYY-MM-DD';
    private value: string = '';
    private changeCallback: (value: string) => any = () => {};
    private optionListeners: Record<string, (value?: string) => string> = {};

    constructor() {
        super();
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
        this.inputEl.placeholder = this.defaultFormat;

        this.sampleEl = document.createElement('div');
        this.sampleEl.addClass('moment-format-sample');

        this.inputEl.addEventListener('input', () => {
            this.value = this.inputEl.value;
            this.onChanged();
            this.changeCallback?.(this.value);
        });
    }

    then(cb: (component: this) => any): this {
        cb(this);
        return this;
    }

    setDefaultFormat(defaultFormat: string): this {
        this.defaultFormat = defaultFormat;
        this.inputEl.placeholder = defaultFormat;
        this.updateSample();
        return this;
    }

    setSampleEl(sampleEl: HTMLElement): this {
        this.sampleEl = sampleEl;
        this.updateSample();
        return this;
    }

    getValue(): string {
        return this.value;
    }

    setValue(value: string): this {
        this.value = value;
        this.inputEl.value = value;
        this.updateSample();
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        this.inputEl.disabled = disabled;
        return this;
    }

    setPlaceholder(placeholder: string): this {
        this.inputEl.placeholder = placeholder;
        return this;
    }

    onChanged(): void {
        this.updateSample();
    }

    onChange(callback: (value: string) => any): this {
        this.changeCallback = callback;
        return this;
    }

    updateSample(): void {
        const format = this.value || this.defaultFormat;
        const now = new Date();
        this.sampleEl.setText(now.toLocaleDateString());
    }

    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
        this.optionListeners = { ...this.optionListeners, ...listeners };
        return this;
    }
} 