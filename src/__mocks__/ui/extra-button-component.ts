import { vi } from 'vitest';
import { BaseComponent } from '../components/base-component';
import type { TooltipOptions, IconName } from 'obsidian';

/**
 * @public
 */
export class ExtraButtonComponent extends BaseComponent {
    /**
     * @public
     */
    extraSettingsEl: HTMLElement = document.createElement('div');

    /**
     * @public
     */
    constructor(containerEl: HTMLElement) {
        super();
        this.extraSettingsEl = containerEl.createDiv('extra-settings-button');
    }

    /**
     * @public
     */
    setDisabled(disabled: boolean): this {
        super.setDisabled(disabled);
        this.extraSettingsEl.toggleClass('is-disabled', disabled);
        return this;
    }

    /**
     * @public
     */
    setTooltip(tooltip: string, _options?: TooltipOptions): this {
        this.extraSettingsEl.setAttribute('aria-label', tooltip);
        return this;
    }

    /**
     * @param icon - ID de l'icône
     * @public
     */
    setIcon(icon: IconName): this {
        this.extraSettingsEl.addClass(`${icon}-icon`);
        return this;
    }

    /**
     * @public
     */
    onClick(callback: (evt: MouseEvent) => any): this {
        this.extraSettingsEl.addEventListener('click', callback);
        return this;
    }
} 