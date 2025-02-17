import { vi } from 'vitest';
import type { TextComponent } from 'obsidian';
import { Component } from './component';

export class MomentFormatComponent extends Component implements TextComponent {
    containerEl: HTMLElement = document.createElement('div');
    inputEl: HTMLInputElement = document.createElement('input');
    
    getValue = vi.fn().mockReturnValue('');
    setValue = vi.fn();
    onChanged = vi.fn();

    sampleEl: HTMLElement;
    disabled: boolean = false;
    private defaultFormat: string = 'YYYY-MM-DD';
    private value: string = '';
    private changeCallback: (value: string) => any = () => {};
    private optionListeners: Record<string, (value?: string) => string> = {};

    constructor() {
        super();
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

    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        this.inputEl.disabled = disabled;
        return this;
    }

    setPlaceholder(placeholder: string): this {
        this.inputEl.placeholder = placeholder;
        return this;
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