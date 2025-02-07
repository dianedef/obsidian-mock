import type { ColorComponent as IColorComponent, RGB, HSL } from 'obsidian';
export declare class ColorComponent implements IColorComponent {
    containerEl: HTMLElement;
    inputEl: HTMLInputElement;
    disabled: boolean;
    private changeCallback;
    constructor(containerEl: HTMLElement);
    getValue(): string;
    setValue(value: string): this;
    getValueRgb(): RGB;
    getValueHsl(): HSL;
    setValueRgb(rgb: RGB): this;
    setValueHsl(hsl: HSL): this;
    setDisabled(disabled: boolean): this;
    onChanged(): void;
    onChange(callback: (value: string) => any): this;
    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this;
    then(cb: (component: this) => any): this;
}
