import { vi } from 'vitest';
import type { 
    App, 
    Plugin, 
    PluginSettingTab as IPluginSettingTab, 
    Setting as ISetting,
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
    ExtraButtonComponent as IExtraButtonComponent
} from 'obsidian';
import { SettingTab } from './setting-tab';
import {
    TextSettingComponent,
    TextAreaSettingComponent,
    ToggleSettingComponent,
    DropdownSettingComponent,
    ButtonSettingComponent,
    SearchSettingComponent,
    SliderSettingComponent,
    MomentFormatSettingComponent,
    ColorSettingComponent,
    ExtraButtonComponent
} from './setting-components';

export class Setting implements ISetting {
    settingEl: HTMLElement;
    infoEl: HTMLElement;
    nameEl: HTMLElement;
    descEl: HTMLElement;
    controlEl: HTMLElement;
    components: BaseComponent[] = [];
    private htmlElements: HTMLElement[] = [];
    private settingComponents: BaseComponent[] = [];

    constructor(containerEl: HTMLElement) {
        this.settingEl = containerEl.createDiv('setting-item');
        this.infoEl = this.settingEl.createDiv('setting-item-info');
        this.nameEl = this.infoEl.createDiv('setting-item-name');
        this.descEl = this.infoEl.createDiv('setting-item-description');
        this.controlEl = this.settingEl.createDiv('setting-item-control');
    }

    setName(name: string): this {
        this.nameEl.setText(name);
        return this;
    }

    setDesc(desc: string): this {
        this.descEl.setText(desc);
        return this;
    }

    setClass(cls: string): this {
        this.settingEl.addClass(cls);
        return this;
    }

    setTooltip(tooltip: string): this {
        this.settingEl.setAttribute('title', tooltip);
        return this;
    }

    setHeading(): this {
        this.settingEl.addClass('setting-item-heading');
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.settingComponents.forEach(component => {
            component.setDisabled(disabled);
        });
        return this;
    }

    getComponents(): HTMLElement[] {
        return this.htmlElements;
    }

    addText(callback: (component: TextComponent) => any): this {
        const component = new TextSettingComponent();
        this.htmlElements.push(component.inputEl);
        this.settingComponents.push(component);
        this.controlEl.appendChild(component.inputEl);
        callback(component);
        return this;
    }

    addTextArea(callback: (component: TextAreaComponent) => any): this {
        const component = new TextAreaSettingComponent();
        this.htmlElements.push(component.inputEl);
        this.settingComponents.push(component);
        this.controlEl.appendChild(component.inputEl);
        callback(component);
        return this;
    }

    addToggle(callback: (component: ToggleComponent) => any): this {
        const component = new ToggleSettingComponent();
        this.htmlElements.push(component.toggleEl);
        this.settingComponents.push(component);
        this.controlEl.appendChild(component.toggleEl);
        callback(component);
        return this;
    }

    addDropdown(callback: (component: DropdownComponent) => any): this {
        const component = new DropdownSettingComponent();
        this.htmlElements.push(component.selectEl);
        this.settingComponents.push(component);
        this.controlEl.appendChild(component.selectEl);
        callback(component);
        return this;
    }

    addButton(callback: (component: ButtonComponent) => any): this {
        const component = new ButtonSettingComponent();
        this.htmlElements.push(component.buttonEl);
        this.settingComponents.push(component);
        this.controlEl.appendChild(component.buttonEl);
        callback(component);
        return this;
    }

    addSearch(callback: (component: SearchComponent) => any): this {
        const component = new SearchSettingComponent();
        this.htmlElements.push(component.inputEl);
        this.htmlElements.push(component.clearButtonEl);
        this.settingComponents.push(component);
        this.controlEl.appendChild(component.inputEl);
        this.controlEl.appendChild(component.clearButtonEl);
        callback(component);
        return this;
    }

    addSlider(callback: (component: SliderComponent) => any): this {
        const component = new SliderSettingComponent();
        this.htmlElements.push(component.sliderEl);
        this.settingComponents.push(component);
        this.controlEl.appendChild(component.sliderEl);
        callback(component);
        return this;
    }

    addMomentFormat(callback: (component: MomentFormatComponent) => any): this {
        const component = new MomentFormatSettingComponent();
        this.htmlElements.push(component.inputEl);
        this.htmlElements.push(component.sampleEl);
        this.settingComponents.push(component);
        this.controlEl.appendChild(component.inputEl);
        this.controlEl.appendChild(component.sampleEl);
        callback(component);
        return this;
    }

    addColorPicker(callback: (component: ColorComponent) => any): this {
        const component = new ColorSettingComponent();
        this.htmlElements.push(component.inputEl);
        this.settingComponents.push(component);
        this.controlEl.appendChild(component.inputEl);
        callback(component);
        return this;
    }

    then(cb: (component: this) => any): this {
        cb(this);
        return this;
    }

    clear(): this {
        this.components.forEach(component => {
            if (component instanceof HTMLElement) {
                component.remove();
            }
        });
        this.components = [];
        return this;
    }

    addExtraButton(cb: (component: ExtraButtonComponent) => any): this {
        const component = new ExtraButtonComponent();
        this.components.push(component);
        this.settingComponents.push(component);
        this.controlEl.appendChild(component.buttonEl);
        this.controlEl.appendChild(component.extraSettingsEl);
        cb(component);
        return this;
    }

    addProgressBar(): this {
        const progressBarContainer = document.createElement('div');
        progressBarContainer.className = 'setting-progress-bar';
        const progressBar = document.createElement('div');
        progressBar.className = 'setting-progress-bar-inner';
        progressBarContainer.appendChild(progressBar);
        this.controlEl.appendChild(progressBarContainer);
        return this;
    }
}

export class PluginSettingTab extends SettingTab implements IPluginSettingTab {
    plugin: Plugin;
    settings: Setting[] = [];

    constructor(app: App, plugin: Plugin) {
        super(app);
        this.plugin = plugin;
    }

    display(): void {
        // Appeler la méthode parent pour nettoyer le conteneur
        super.display();
        this.settings = [];
    }

    hide(): void {
        // Appeler la méthode parent pour nettoyer
        super.hide();
        this.settings = [];
    }

    addSetting(callback: (setting: Setting) => any): Setting {
        const setting = new Setting(this.containerEl);
        callback(setting);
        this.settings.push(setting);
        return setting;
    }

    getSettings(): Setting[] {
        return this.settings;
    }
} 