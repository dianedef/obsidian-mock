import { vi } from 'vitest';
import type { DropdownComponent as IDropdownComponent } from 'obsidian';
import { BaseComponent } from '../components/component';

/**
 * Dropdown component mock
 * @public
 */
export class DropdownComponent extends BaseComponent implements IDropdownComponent {
    /**
     * HTML select element
     * @public
     */
    selectEl: HTMLSelectElement;
    disabled: boolean = false;

    constructor(containerEl: HTMLElement) {
        super();
        this.selectEl = containerEl.createEl('select');
    }

    /**
     * @public
     */
    addOption(value: string, display: string): this {
        const option = this.selectEl.createEl('option');
        option.value = value;
        option.text = display;
        return this;
    }

    /**
     * @public
     */
    addOptions(options: Record<string, string>): this {
        for (const [value, display] of Object.entries(options)) {
            this.addOption(value, display);
        }
        return this;
    }

    /**
     * @public
     */
    getValue(): string {
        return this.selectEl.value;
    }

    /**
     * @public
     */
    setValue(value: string): this {
        this.selectEl.value = value;
        return this;
    }

    /**
     * @public
     */
    onChange(callback: (value: string) => any): this {
        this.selectEl.addEventListener('change', () => {
            callback(this.getValue());
        });
        return this;
    }

    /**
     * @public
     */
    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        this.selectEl.disabled = disabled;
        return this;
    }

    then(cb: (component: this) => any): this {
        cb(this);
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
        this.selectEl.addEventListener('change', () => {
            const value = this.getValue();
            if (listeners[key]) {
                listeners[key](value);
            }
        });
        return this;
    }
} 