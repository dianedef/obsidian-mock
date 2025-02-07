import { vi } from 'vitest';
import type { ToggleComponent as IToggleComponent } from 'obsidian';

export class ToggleComponent implements IToggleComponent {
    toggleEl: HTMLElement;
    disabled: boolean = false;
    private clickCallback: ((value: boolean) => any) | null = null;
    private changeCallback: ((value: boolean) => any) | null = null;

    constructor(containerEl: HTMLElement) {
        this.toggleEl = document.createElement('div');
        this.toggleEl.className = 'checkbox-container';
        containerEl.appendChild(this.toggleEl);
        this.toggleEl.addEventListener('click', this.handleClick.bind(this));
    }

    getValue(): boolean {
        return this.toggleEl.classList.contains('is-enabled');
    }

    setValue(value: boolean): this {
        this.toggleEl.classList.toggle('is-enabled', value);
        if (this.changeCallback) {
            this.changeCallback(value);
        }
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        this.toggleEl.classList.toggle('is-disabled', disabled);
        return this;
    }

    setTooltip(tooltip: string): this {
        this.toggleEl.setAttribute('aria-label', tooltip);
        return this;
    }

    onClick(): void {
        if (!this.disabled && this.clickCallback) {
            const newValue = !this.getValue();
            this.setValue(newValue);
            this.clickCallback(newValue);
        }
    }

    onChange(callback: (value: boolean) => any): this {
        this.changeCallback = callback;
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: boolean) => boolean>, key: string): this {
        this.onChange((value) => {
            if (listeners[key]) {
                listeners[key](value);
            }
            return value;
        });
        return this;
    }

    private handleClick(): void {
        this.onClick();
    }

    then(cb: (component: this) => any): this {
        cb(this);
        return this;
    }
} 