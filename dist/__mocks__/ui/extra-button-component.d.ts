import { BaseComponent } from '../components/base-component';
import type { TooltipOptions, IconName } from 'obsidian';
/**
 * @public
 */
export declare class ExtraButtonComponent extends BaseComponent {
    /**
     * @public
     */
    extraSettingsEl: HTMLElement;
    /**
     * @public
     */
    constructor(containerEl: HTMLElement);
    /**
     * @public
     */
    setDisabled(disabled: boolean): this;
    /**
     * @public
     */
    setTooltip(tooltip: string, _options?: TooltipOptions): this;
    /**
     * @param icon - ID de l'icône
     * @public
     */
    setIcon(icon: IconName): this;
    /**
     * @public
     */
    onClick(callback: (evt: MouseEvent) => any): this;
}
