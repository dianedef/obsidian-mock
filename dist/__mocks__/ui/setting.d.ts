import { Setting as ObsidianSetting, TextComponent as ObsidianTextComponent, ToggleComponent as ObsidianToggleComponent, ButtonComponent as ObsidianButtonComponent, TooltipOptions, DropdownComponent, SliderComponent, TextAreaComponent, ColorComponent, ExtraButtonComponent } from 'obsidian';
import { Events } from '../components/events';
export declare class TextComponent implements ObsidianTextComponent {
    containerEl: HTMLElement;
    inputEl: HTMLInputElement;
    disabled: boolean;
    constructor(containerEl: HTMLElement);
    setValue(value: string): this;
    getValue(): string;
    onChange(callback: (value: string) => any): this;
    setDisabled(disabled: boolean): this;
    setPlaceholder(placeholder: string): this;
    onChanged(): void;
    registerOptionListener(_listeners: Record<string, (value?: string) => string>): this;
    then(resolve: (component: this) => any): this;
}
export declare class ToggleComponent implements ObsidianToggleComponent {
    containerEl: HTMLElement;
    toggleEl: HTMLInputElement;
    disabled: boolean;
    constructor(containerEl: HTMLElement);
    setValue(value: boolean): this;
    getValue(): boolean;
    onChange(callback: (value: boolean) => any): this;
    setDisabled(disabled: boolean): this;
    setTooltip(tooltip: string): this;
    onClick(): void;
    registerOptionListener(listeners: Record<string, (value?: boolean) => boolean>, key: string): this;
    then(resolve: (component: this) => any): this;
}
export declare class ButtonComponent implements ObsidianButtonComponent {
    containerEl: HTMLElement;
    buttonEl: HTMLButtonElement;
    disabled: boolean;
    constructor(containerEl: HTMLElement);
    setButtonText(name: string): this;
    onClick(callback: (evt: MouseEvent) => any): this;
    setDisabled(disabled: boolean): this;
    setCta(): this;
    removeCta(): this;
    setWarning(): this;
    setTooltip(tooltip: string, _options?: TooltipOptions): this;
    setIcon(icon: string): this;
    setClass(cls: string): this;
    then(resolve: (component: this) => any): this;
}
export declare class Setting extends Events implements ObsidianSetting {
    settingEl: HTMLElement;
    infoEl: HTMLElement;
    nameEl: HTMLElement;
    descEl: HTMLElement;
    controlEl: HTMLElement;
    components: Array<TextComponent | DropdownComponent | ButtonComponent | ToggleComponent | SliderComponent | TextAreaComponent | ColorComponent | ExtraButtonComponent>;
    constructor(containerEl: HTMLElement);
    setName(name: string | DocumentFragment): this;
    setDesc(desc: string | DocumentFragment): this;
    setClass(cls: string): this;
    setTooltip(tooltip: string): this;
    setHeading(): this;
    setDisabled(disabled: boolean): this;
    addButton(cb: (component: ButtonComponent) => any): this;
    addExtraButton(cb: (component: ExtraButtonComponent) => any): this;
    addToggle(cb: (component: ToggleComponent) => any): this;
    addText(cb: (component: TextComponent) => any): this;
    addTextArea(cb: (component: TextAreaComponent) => any): this;
    addSlider(cb: (component: SliderComponent) => any): this;
    addDropdown(cb: (component: DropdownComponent) => any): this;
    addColorPicker(cb: (component: ColorComponent) => any): this;
    addSearch(cb: (component: TextComponent) => any): this;
    addMomentFormat(cb: (component: TextComponent) => any): this;
    addProgressBar(): this;
    clear(): this;
    then(cb: (setting: this) => any): this;
}
