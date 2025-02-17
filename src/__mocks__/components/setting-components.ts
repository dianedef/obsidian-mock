import { vi } from 'vitest';
import type { 
    TextComponent, 
    TextAreaComponent, 
    ToggleComponent, 
    DropdownComponent, 
    ButtonComponent,
    SearchComponent,
    SliderComponent,
    MomentFormatComponent,
    ColorComponent,
    BaseComponent,
    RGB
} from 'obsidian';

export class BaseSettingComponent implements BaseComponent {
    disabled: boolean = false;
    
    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        return this;
    }

    then(cb: (component: this) => any): this {
        cb(this);
        return this;
    }
}

export class TextSettingComponent extends BaseSettingComponent implements TextComponent {
    inputEl: HTMLInputElement;

    constructor() {
        super();
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
    }

    getValue(): string {
        return this.inputEl.value;
    }

    setValue(value: string): this {
        this.inputEl.value = value;
        return this;
    }

    setPlaceholder(placeholder: string): this {
        this.inputEl.placeholder = placeholder;
        return this;
    }

    onChanged(): void {
        // Mock implementation
    }

    onChange(callback: (value: string) => any): this {
        this.inputEl.addEventListener('input', () => callback(this.getValue()));
        return this;
    }

    then(cb: (component: TextComponent) => any): this {
        cb(this);
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
        this.onChange(() => {
            const value = this.getValue();
            if (listeners[key]) {
                this.setValue(listeners[key](value));
            }
        });
        return this;
    }
}

export class TextAreaSettingComponent extends BaseSettingComponent implements TextAreaComponent {
    inputEl: HTMLTextAreaElement;

    constructor() {
        super();
        this.inputEl = document.createElement('textarea');
    }

    getValue(): string {
        return this.inputEl.value;
    }

    setValue(value: string): this {
        this.inputEl.value = value;
        return this;
    }

    setPlaceholder(placeholder: string): this {
        this.inputEl.placeholder = placeholder;
        return this;
    }

    onChanged(): void {
        // Mock implementation
    }

    onChange(callback: (value: string) => any): this {
        this.inputEl.addEventListener('input', () => callback(this.getValue()));
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
        this.onChange(() => {
            const value = this.getValue();
            if (listeners[key]) {
                this.setValue(listeners[key](value));
            }
        });
        return this;
    }
}

export class ToggleSettingComponent extends BaseSettingComponent implements ToggleComponent {
    toggleEl: HTMLInputElement;

    constructor() {
        super();
        this.toggleEl = document.createElement('input');
        this.toggleEl.type = 'checkbox';
    }

    getValue(): boolean {
        return this.toggleEl.checked;
    }

    setValue(value: boolean): this {
        this.toggleEl.checked = value;
        return this;
    }

    onClick(callback: (evt: MouseEvent) => any): this {
        this.toggleEl.addEventListener('click', callback);
        return this;
    }

    onChange(callback: (value: boolean) => any): this {
        this.toggleEl.addEventListener('change', () => callback(this.getValue()));
        return this;
    }

    setTooltip(tooltip: string): this {
        this.toggleEl.title = tooltip;
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: boolean) => boolean>, key: string): this {
        this.onChange(() => {
            const value = this.getValue();
            if (listeners[key]) {
                this.setValue(listeners[key](value));
            }
        });
        return this;
    }

    onClick(): void {
        // Mock implementation
    }
}

export class DropdownSettingComponent extends BaseSettingComponent implements DropdownComponent {
    selectEl: HTMLSelectElement;

    constructor() {
        super();
        this.selectEl = document.createElement('select');
    }

    addOption(value: string, display: string): this {
        const option = document.createElement('option');
        option.value = value;
        option.text = display;
        this.selectEl.add(option);
        return this;
    }

    addOptions(options: Record<string, string>): this {
        Object.entries(options).forEach(([value, display]) => {
            this.addOption(value, display);
        });
        return this;
    }

    getValue(): string {
        return this.selectEl.value;
    }

    setValue(value: string): this {
        this.selectEl.value = value;
        return this;
    }

    onChange(callback: (value: string) => any): this {
        this.selectEl.addEventListener('change', () => callback(this.getValue()));
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
        this.onChange(() => {
            const value = this.getValue();
            if (listeners[key]) {
                this.setValue(listeners[key](value));
            }
        });
        return this;
    }
}

export class ButtonSettingComponent extends BaseSettingComponent implements ButtonComponent {
    buttonEl: HTMLButtonElement;

    constructor() {
        super();
        this.buttonEl = document.createElement('button');
    }

    setButtonText(name: string): this {
        this.buttonEl.textContent = name;
        return this;
    }

    setCta(): this {
        this.buttonEl.classList.add('mod-cta');
        return this;
    }

    removeCta(): this {
        this.buttonEl.classList.remove('mod-cta');
        return this;
    }

    setWarning(): this {
        this.buttonEl.classList.add('mod-warning');
        return this;
    }

    setTooltip(tooltip: string): this {
        this.buttonEl.title = tooltip;
        return this;
    }

    onClick(callback: (evt: MouseEvent) => any): this {
        this.buttonEl.addEventListener('click', callback);
        return this;
    }

    setIcon(icon: string): this {
        const iconEl = document.createElement('span');
        iconEl.classList.add('setting-button-icon');
        iconEl.classList.add(icon);
        this.buttonEl.prepend(iconEl);
        return this;
    }

    setClass(cls: string): this {
        this.buttonEl.classList.add(cls);
        return this;
    }
}

export class SearchSettingComponent extends BaseSettingComponent implements SearchComponent {
    inputEl: HTMLInputElement;
    clearButtonEl: HTMLButtonElement;

    constructor() {
        super();
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'search';
        this.clearButtonEl = document.createElement('button');
        this.clearButtonEl.classList.add('search-input-clear-button');
    }

    getValue(): string {
        return this.inputEl.value;
    }

    setValue(value: string): this {
        this.inputEl.value = value;
        return this;
    }

    setPlaceholder(placeholder: string): this {
        this.inputEl.placeholder = placeholder;
        return this;
    }

    onChanged(): void {
        // Mock implementation
    }

    onChange(callback: (value: string) => any): this {
        this.inputEl.addEventListener('input', () => callback(this.getValue()));
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
        this.onChange(() => {
            const value = this.getValue();
            if (listeners[key]) {
                this.setValue(listeners[key](value));
            }
        });
        return this;
    }
}

export class SliderSettingComponent extends BaseSettingComponent implements SliderComponent {
    sliderEl: HTMLInputElement;

    constructor() {
        super();
        this.sliderEl = document.createElement('input');
        this.sliderEl.type = 'range';
    }

    getValue(): number {
        return parseFloat(this.sliderEl.value);
    }

    setValue(value: number): this {
        this.sliderEl.value = value.toString();
        return this;
    }

    setLimits(min: number, max: number, step: number): this {
        this.sliderEl.min = min.toString();
        this.sliderEl.max = max.toString();
        this.sliderEl.step = step.toString();
        return this;
    }

    setDynamicTooltip(): this {
        return this;
    }

    showTooltip(): void {
        // Mock implementation
    }

    setInstant(): this {
        return this;
    }

    onChange(callback: (value: number) => any): this {
        this.sliderEl.addEventListener('input', () => callback(this.getValue()));
        return this;
    }

    getValuePretty(): string {
        return this.getValue().toString();
    }

    registerOptionListener(listeners: Record<string, (value?: number) => number>, key: string): this {
        this.onChange(() => {
            const value = this.getValue();
            if (listeners[key]) {
                this.setValue(listeners[key](value));
            }
        });
        return this;
    }
}

export class MomentFormatSettingComponent extends BaseSettingComponent implements MomentFormatComponent {
    inputEl: HTMLInputElement;
    sampleEl: HTMLElement;

    constructor() {
        super();
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
        this.sampleEl = document.createElement('div');
    }

    getValue(): string {
        return this.inputEl.value;
    }

    setValue(value: string): this {
        this.inputEl.value = value;
        return this;
    }

    setPlaceholder(placeholder: string): this {
        this.inputEl.placeholder = placeholder;
        return this;
    }

    setSampleEl(el: HTMLElement): this {
        this.sampleEl = el;
        return this;
    }

    setDefaultFormat(defaultFormat: string): this {
        this.inputEl.placeholder = defaultFormat;
        return this;
    }

    onChanged(): void {
        // Mock implementation
    }

    onChange(callback: (value: string) => any): this {
        this.inputEl.addEventListener('input', () => callback(this.getValue()));
        return this;
    }

    updateSample(): void {
        // Mock implementation
    }

    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
        this.onChange(() => {
            const value = this.getValue();
            if (listeners[key]) {
                this.setValue(listeners[key](value));
            }
        });
        return this;
    }
}

export class ColorSettingComponent extends BaseSettingComponent implements ColorComponent {
    inputEl: HTMLInputElement;

    constructor() {
        super();
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'color';
    }

    getValue(): string {
        return this.inputEl.value;
    }

    setValue(value: string): this {
        this.inputEl.value = value;
        return this;
    }

    getValueRgb(): { r: number; g: number; b: number } {
        const hex = this.getValue().substring(1);
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    }

    getValueHsl(): { h: number; s: number; l: number } {
        const { r, g, b } = this.getValueRgb();
        // Mock implementation - retourne des valeurs par défaut
        return { h: 0, s: 0, l: 0 };
    }

    setValueRgb(rgb: RGB): this {
        const hex = '#' + [rgb.r, rgb.g, rgb.b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
        return this.setValue(hex);
    }

    setValueHsl(hsl: { h: number; s: number; l: number }): this {
        // Mock implementation - convertit simplement en RGB avec des valeurs par défaut
        return this.setValueRgb({ r: 0, g: 0, b: 0 });
    }

    onChange(callback: (value: string) => any): this {
        this.inputEl.addEventListener('input', () => callback(this.getValue()));
        return this;
    }

    then(cb: (component: ColorComponent) => any): this {
        cb(this);
        return this;
    }

    registerOptionListener(listeners: Record<string, (value?: string) => string>, key: string): this {
        this.onChange(() => {
            const value = this.getValue();
            if (listeners[key]) {
                this.setValue(listeners[key](value));
            }
        });
        return this;
    }
}

export class ExtraButtonComponent extends ButtonSettingComponent {
    extraSettingsEl: HTMLElement;

    constructor() {
        super();
        this.extraSettingsEl = document.createElement('div');
        this.extraSettingsEl.className = 'setting-extra-setting-button';
    }
} 