import type { ToggleComponent as IToggleComponent } from 'obsidian';
export declare class ToggleComponent implements IToggleComponent {
    toggleEl: HTMLElement;
    disabled: boolean;
    private clickCallback;
    private changeCallback;
    constructor(containerEl: HTMLElement);
    getValue(): boolean;
    setValue(value: boolean): this;
    setDisabled(disabled: boolean): this;
    setTooltip(tooltip: string): this;
    onClick(): void;
    onChange(callback: (value: boolean) => any): this;
    registerOptionListener(listeners: Record<string, (value?: boolean) => boolean>, key: string): this;
    private handleClick;
    then(cb: (component: this) => any): this;
}
