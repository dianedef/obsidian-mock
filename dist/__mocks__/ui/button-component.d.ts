import type { ButtonComponent as IButtonComponent } from 'obsidian';
import { BaseComponent } from '../components/component';
export declare class ButtonComponent extends BaseComponent implements IButtonComponent {
    /**
     * @public
     */
    buttonEl: HTMLButtonElement;
    disabled: boolean;
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
    setCta(): this;
    /**
     * @public
     */
    removeCta(): this;
    /**
     * @public
     */
    setWarning(): this;
    /**
     * @public
     */
    setTooltip(tooltip: string): this;
    /**
     * @public
     */
    setButtonText(text: string): this;
    /**
     * @public
     */
    setClass(cls: string): this;
    /**
     * @public
     */
    setIcon(icon: string): this;
    /**
     * @public
     */
    onClick(callback: (evt: MouseEvent) => any): this;
    then(cb: (component: this) => any): this;
}
