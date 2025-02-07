import { vi } from 'vitest';
import type { ButtonComponent as IButtonComponent } from 'obsidian';
import { setIcon } from 'obsidian';
import { BaseComponent } from '../components/component';

export class ButtonComponent extends BaseComponent implements IButtonComponent {
    /**
     * @public
     */
    buttonEl: HTMLButtonElement;
    disabled: boolean = false;

    /**
     * @public
     */
    constructor(containerEl: HTMLElement) {
        super();
        this.buttonEl = containerEl.createEl('button');
    }

    /**
     * @public
     */
    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        this.buttonEl.disabled = disabled;
        return this;
    }

    /**
     * @public
     */
    setCta(): this {
        this.buttonEl.addClass('mod-cta');
        return this;
    }

    /**
     * @public
     */
    removeCta(): this {
        this.buttonEl.removeClass('mod-cta');
        return this;
    }

    /**
     * @public
     */
    setWarning(): this {
        this.buttonEl.addClass('mod-warning');
        return this;
    }

    /**
     * @public
     */
    setTooltip(tooltip: string): this {
        this.buttonEl.setAttribute('aria-label', tooltip);
        return this;
    }

    /**
     * @public
     */
    setButtonText(text: string): this {
        this.buttonEl.textContent = text;
        return this;
    }

    /**
     * @public
     */
    setClass(cls: string): this {
        this.buttonEl.className = cls;
        return this;
    }

    /**
     * @public
     */
    setIcon(icon: string): this {
        setIcon(this.buttonEl, icon);
        return this;
    }

    /**
     * @public
     */
    onClick(callback: (evt: MouseEvent) => any): this {
        this.buttonEl.addEventListener('click', callback);
        return this;
    }

    then(cb: (component: this) => any): this {
        cb(this);
        return this;
    }
} 