import type { DropdownComponent as IDropdownComponent } from 'obsidian';
import { BaseComponent } from '../components/component';
/**
 * Dropdown component mock
 * @public
 */
export declare class DropdownComponent extends BaseComponent implements IDropdownComponent {
    /**
     * HTML select element
     * @public
     */
    selectEl: HTMLSelectElement;
    disabled: boolean;
    constructor(containerEl: HTMLElement);
    /**
     * @public
     */
    addOption(value: string, display: string): this;
    /**
     * @public
     */
    addOptions(options: Record<string, string>): this;
    /**
     * @public
     */
    getValue(): string;
    /**
     * @public
     */
    setValue(value: string): this;
    /**
     * @public
     */
    onChange(callback: (value: string) => any): this;
    /**
     * @public
     */
    setDisabled(disabled: boolean): this;
    then(cb: (component: this) => any): this;
    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this;
}
