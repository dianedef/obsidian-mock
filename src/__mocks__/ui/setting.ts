import { vi } from 'vitest';
import { 
    Setting as ObsidianSetting,
    TextComponent as ObsidianTextComponent,
    ToggleComponent as ObsidianToggleComponent,
    ButtonComponent as ObsidianButtonComponent,
    TooltipOptions,
    DropdownComponent,
    SliderComponent,
    TextAreaComponent,
    ColorComponent,
    ExtraButtonComponent
} from 'obsidian';
import { Events } from '../components/events';

// Components
export class TextComponent implements ObsidianTextComponent {
    containerEl: HTMLElement;
    inputEl: HTMLInputElement;
    disabled: boolean = false;

    constructor(containerEl: HTMLElement) {
        this.containerEl = containerEl;
        this.inputEl = document.createElement('input');
        this.containerEl.appendChild(this.inputEl);
    }

    setValue(value: string): this {
        this.inputEl.value = value;
        return this;
    }

    getValue(): string {
        return this.inputEl.value;
    }

    onChange(callback: (value: string) => any): this {
        this.inputEl.addEventListener('input', () => callback(this.getValue()));
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.inputEl.disabled = disabled;
        return this;
    }

    setPlaceholder(placeholder: string): this {
        this.inputEl.placeholder = placeholder;
        return this;
    }

    onChanged(): void {}
    
    registerOptionListener(_listeners: Record<string, (value?: string) => string>): this {
        return this;
    }

    then(resolve: (component: this) => any): this {
        resolve(this);
        return this;
    }
}

export class ToggleComponent implements ObsidianToggleComponent {
    containerEl: HTMLElement;
    toggleEl: HTMLInputElement;
    disabled: boolean = false;

    constructor(containerEl: HTMLElement) {
        this.containerEl = containerEl;
        this.toggleEl = document.createElement('input');
        this.toggleEl.type = 'checkbox';
        this.containerEl.appendChild(this.toggleEl);
    }

    setValue(value: boolean): this {
        this.toggleEl.checked = value;
        return this;
    }

    getValue(): boolean {
        return this.toggleEl.checked;
    }

    onChange(callback: (value: boolean) => any): this {
        this.toggleEl.addEventListener('change', () => callback(this.getValue()));
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.toggleEl.disabled = disabled;
        return this;
    }

    setTooltip(tooltip: string): this {
        this.toggleEl.title = tooltip;
        return this;
    }

    onClick(): void {}
    
    registerOptionListener(listeners: Record<string, (value?: boolean) => boolean>, key: string): this {
        return this;
    }

    then(resolve: (component: this) => any): this {
        resolve(this);
        return this;
    }
}

export class ButtonComponent implements ObsidianButtonComponent {
    containerEl: HTMLElement;
    buttonEl: HTMLButtonElement;
    disabled: boolean = false;

    constructor(containerEl: HTMLElement) {
        this.containerEl = containerEl;
        this.buttonEl = document.createElement('button');
        this.containerEl.appendChild(this.buttonEl);
    }

    setButtonText(name: string): this {
        this.buttonEl.textContent = name;
        return this;
    }

    onClick(callback: (evt: MouseEvent) => any): this {
        this.buttonEl.addEventListener('click', callback);
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.buttonEl.disabled = disabled;
        return this;
    }

    setCta(): this {
        this.buttonEl.addClass('mod-cta');
        return this;
    }

    removeCta(): this {
        this.buttonEl.removeClass('mod-cta');
        return this;
    }

    setWarning(): this {
        this.buttonEl.addClass('mod-warning');
        return this;
    }

    setTooltip(tooltip: string, _options?: TooltipOptions): this {
        this.buttonEl.setAttribute('aria-label', tooltip);
        return this;
    }

    setIcon(icon: string): this {
        this.buttonEl.addClass(`${icon}-icon`);
        return this;
    }

    setClass(cls: string): this {
        this.buttonEl.addClass(cls);
        return this;
    }

    then(resolve: (component: this) => any): this {
        resolve(this);
        return this;
    }
}

export class Setting extends Events implements ObsidianSetting {
    settingEl: HTMLElement;
    infoEl: HTMLElement;
    nameEl: HTMLElement;
    descEl: HTMLElement;
    controlEl: HTMLElement;
    components: Array<TextComponent | DropdownComponent | ButtonComponent | ToggleComponent | SliderComponent | TextAreaComponent | ColorComponent | ExtraButtonComponent> = [];

    constructor(containerEl: HTMLElement) {
        super();
        this.settingEl = containerEl.createDiv('setting-item');
        this.infoEl = this.settingEl.createDiv('setting-item-info');
        this.nameEl = this.infoEl.createDiv('setting-item-name');
        this.descEl = this.infoEl.createDiv('setting-item-description');
        this.controlEl = this.settingEl.createDiv('setting-item-control');
    }

    setName(name: string | DocumentFragment): this {
        this.nameEl.empty();
        if (name instanceof DocumentFragment) {
            this.nameEl.appendChild(name);
        } else {
            this.nameEl.textContent = name;
        }
        return this;
    }

    setDesc(desc: string | DocumentFragment): this {
        this.descEl.empty();
        if (desc instanceof DocumentFragment) {
            this.descEl.appendChild(desc);
        } else {
            this.descEl.textContent = desc;
        }
        return this;
    }

    setClass(cls: string): this {
        this.settingEl.className = `setting-item ${cls}`;
        return this;
    }

    setTooltip(tooltip: string): this {
        this.settingEl.setAttribute('aria-label', tooltip);
        return this;
    }

    setHeading(): this {
        this.settingEl.addClass('setting-item-heading');
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.settingEl.toggleClass('is-disabled', disabled);
        this.components.forEach(component => {
            if (component.setDisabled) {
                component.setDisabled(disabled);
            }
        });
        return this;
    }

    addButton(cb: (component: ButtonComponent) => any): this {
        const buttonComponent = new ButtonComponent(this.controlEl);
        this.components.push(buttonComponent);
        cb(buttonComponent);
        return this;
    }

    addExtraButton(cb: (component: ExtraButtonComponent) => any): this {
        const extraButtonComponent = new ExtraButtonComponent(this.controlEl);
        this.components.push(extraButtonComponent);
        cb(extraButtonComponent);
        return this;
    }

    addToggle(cb: (component: ToggleComponent) => any): this {
        const toggleComponent = new ToggleComponent(this.controlEl);
        this.components.push(toggleComponent);
        cb(toggleComponent);
        return this;
    }

    addText(cb: (component: TextComponent) => any): this {
        const textComponent = new TextComponent(this.controlEl);
        this.components.push(textComponent);
        cb(textComponent);
        return this;
    }

    addTextArea(cb: (component: TextAreaComponent) => any): this {
        const textAreaComponent = new TextAreaComponent(this.controlEl);
        this.components.push(textAreaComponent);
        cb(textAreaComponent);
        return this;
    }

    addSlider(cb: (component: SliderComponent) => any): this {
        const sliderComponent = new SliderComponent(this.controlEl);
        this.components.push(sliderComponent);
        cb(sliderComponent);
        return this;
    }

    addDropdown(cb: (component: DropdownComponent) => any): this {
        const dropdownComponent = new DropdownComponent(this.controlEl);
        this.components.push(dropdownComponent);
        cb(dropdownComponent);
        return this;
    }

    addColorPicker(cb: (component: ColorComponent) => any): this {
        const colorComponent = new ColorComponent(this.controlEl);
        this.components.push(colorComponent);
        cb(colorComponent);
        return this;
    }

    addSearch(cb: (component: TextComponent) => any): this {
        const searchComponent = new TextComponent(this.controlEl);
        this.components.push(searchComponent);
        cb(searchComponent);
        return this;
    }

    addMomentFormat(cb: (component: TextComponent) => any): this {
        const momentComponent = new TextComponent(this.controlEl);
        this.components.push(momentComponent);
        cb(momentComponent);
        return this;
    }

    addProgressBar(): this {
        return this;
    }

    clear(): this {
        this.components = [];
        this.controlEl.empty();
        return this;
    }

    then(cb: (setting: this) => any): this {
        cb(this);
        return this;
    }
}
