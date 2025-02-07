import type { TextComponent } from 'obsidian';
import { MockComponent } from './component';
export declare class MockMomentFormatComponent extends MockComponent implements TextComponent {
    inputEl: HTMLInputElement;
    sampleEl: HTMLElement;
    disabled: boolean;
    private defaultFormat;
    private value;
    private changeCallback;
    private optionListeners;
    constructor();
    then(cb: (component: this) => any): this;
    setDefaultFormat(defaultFormat: string): this;
    setSampleEl(sampleEl: HTMLElement): this;
    getValue(): string;
    setValue(value: string): this;
    setDisabled(disabled: boolean): this;
    setPlaceholder(placeholder: string): this;
    onChanged(): void;
    onChange(callback: (value: string) => any): this;
    updateSample(): void;
    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this;
}
