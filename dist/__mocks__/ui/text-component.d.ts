import type { TextComponent as ITextComponent, TextAreaComponent as ITextAreaComponent } from 'obsidian';
import { Events } from '../components/events';
export declare class TextComponent extends Events implements ITextComponent {
    inputEl: HTMLInputElement;
    disabled: boolean;
    constructor(containerEl: HTMLElement);
    getValue(): string;
    setValue(value: string): this;
    setPlaceholder(placeholder: string): this;
    onChanged(): void;
    onChange(callback: (value: string) => any): this;
    setDisabled(disabled: boolean): this;
    then(cb: (component: this) => any): this;
    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this;
}
export declare class TextAreaComponent extends Events implements ITextAreaComponent {
    inputEl: HTMLTextAreaElement;
    disabled: boolean;
    constructor(containerEl: HTMLElement);
    getValue(): string;
    setValue(value: string): this;
    setPlaceholder(placeholder: string): this;
    onChanged(): void;
    onChange(callback: (value: string) => any): this;
    setDisabled(disabled: boolean): this;
    then(cb: (component: this) => any): this;
    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this;
}
