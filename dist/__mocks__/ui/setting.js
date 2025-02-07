import { DropdownComponent, SliderComponent, TextAreaComponent, ColorComponent, ExtraButtonComponent } from 'obsidian';
import { Events } from '../components/events';
// Components
export class TextComponent {
    constructor(containerEl) {
        this.disabled = false;
        this.containerEl = containerEl;
        this.inputEl = document.createElement('input');
        this.containerEl.appendChild(this.inputEl);
    }
    setValue(value) {
        this.inputEl.value = value;
        return this;
    }
    getValue() {
        return this.inputEl.value;
    }
    onChange(callback) {
        this.inputEl.addEventListener('input', () => callback(this.getValue()));
        return this;
    }
    setDisabled(disabled) {
        this.inputEl.disabled = disabled;
        return this;
    }
    setPlaceholder(placeholder) {
        this.inputEl.placeholder = placeholder;
        return this;
    }
    onChanged() { }
    registerOptionListener(_listeners) {
        return this;
    }
    then(resolve) {
        resolve(this);
        return this;
    }
}
export class ToggleComponent {
    constructor(containerEl) {
        this.disabled = false;
        this.containerEl = containerEl;
        this.toggleEl = document.createElement('input');
        this.toggleEl.type = 'checkbox';
        this.containerEl.appendChild(this.toggleEl);
    }
    setValue(value) {
        this.toggleEl.checked = value;
        return this;
    }
    getValue() {
        return this.toggleEl.checked;
    }
    onChange(callback) {
        this.toggleEl.addEventListener('change', () => callback(this.getValue()));
        return this;
    }
    setDisabled(disabled) {
        this.toggleEl.disabled = disabled;
        return this;
    }
    setTooltip(tooltip) {
        this.toggleEl.title = tooltip;
        return this;
    }
    onClick() { }
    registerOptionListener(listeners, key) {
        return this;
    }
    then(resolve) {
        resolve(this);
        return this;
    }
}
export class ButtonComponent {
    constructor(containerEl) {
        this.disabled = false;
        this.containerEl = containerEl;
        this.buttonEl = document.createElement('button');
        this.containerEl.appendChild(this.buttonEl);
    }
    setButtonText(name) {
        this.buttonEl.textContent = name;
        return this;
    }
    onClick(callback) {
        this.buttonEl.addEventListener('click', callback);
        return this;
    }
    setDisabled(disabled) {
        this.buttonEl.disabled = disabled;
        return this;
    }
    setCta() {
        this.buttonEl.addClass('mod-cta');
        return this;
    }
    removeCta() {
        this.buttonEl.removeClass('mod-cta');
        return this;
    }
    setWarning() {
        this.buttonEl.addClass('mod-warning');
        return this;
    }
    setTooltip(tooltip, _options) {
        this.buttonEl.setAttribute('aria-label', tooltip);
        return this;
    }
    setIcon(icon) {
        this.buttonEl.addClass(`${icon}-icon`);
        return this;
    }
    setClass(cls) {
        this.buttonEl.addClass(cls);
        return this;
    }
    then(resolve) {
        resolve(this);
        return this;
    }
}
export class Setting extends Events {
    constructor(containerEl) {
        super();
        this.components = [];
        this.settingEl = containerEl.createDiv('setting-item');
        this.infoEl = this.settingEl.createDiv('setting-item-info');
        this.nameEl = this.infoEl.createDiv('setting-item-name');
        this.descEl = this.infoEl.createDiv('setting-item-description');
        this.controlEl = this.settingEl.createDiv('setting-item-control');
    }
    setName(name) {
        this.nameEl.empty();
        if (name instanceof DocumentFragment) {
            this.nameEl.appendChild(name);
        }
        else {
            this.nameEl.textContent = name;
        }
        return this;
    }
    setDesc(desc) {
        this.descEl.empty();
        if (desc instanceof DocumentFragment) {
            this.descEl.appendChild(desc);
        }
        else {
            this.descEl.textContent = desc;
        }
        return this;
    }
    setClass(cls) {
        this.settingEl.className = `setting-item ${cls}`;
        return this;
    }
    setTooltip(tooltip) {
        this.settingEl.setAttribute('aria-label', tooltip);
        return this;
    }
    setHeading() {
        this.settingEl.addClass('setting-item-heading');
        return this;
    }
    setDisabled(disabled) {
        this.settingEl.toggleClass('is-disabled', disabled);
        this.components.forEach(component => {
            if (component.setDisabled) {
                component.setDisabled(disabled);
            }
        });
        return this;
    }
    addButton(cb) {
        const buttonComponent = new ButtonComponent(this.controlEl);
        this.components.push(buttonComponent);
        cb(buttonComponent);
        return this;
    }
    addExtraButton(cb) {
        const extraButtonComponent = new ExtraButtonComponent(this.controlEl);
        this.components.push(extraButtonComponent);
        cb(extraButtonComponent);
        return this;
    }
    addToggle(cb) {
        const toggleComponent = new ToggleComponent(this.controlEl);
        this.components.push(toggleComponent);
        cb(toggleComponent);
        return this;
    }
    addText(cb) {
        const textComponent = new TextComponent(this.controlEl);
        this.components.push(textComponent);
        cb(textComponent);
        return this;
    }
    addTextArea(cb) {
        const textAreaComponent = new TextAreaComponent(this.controlEl);
        this.components.push(textAreaComponent);
        cb(textAreaComponent);
        return this;
    }
    addSlider(cb) {
        const sliderComponent = new SliderComponent(this.controlEl);
        this.components.push(sliderComponent);
        cb(sliderComponent);
        return this;
    }
    addDropdown(cb) {
        const dropdownComponent = new DropdownComponent(this.controlEl);
        this.components.push(dropdownComponent);
        cb(dropdownComponent);
        return this;
    }
    addColorPicker(cb) {
        const colorComponent = new ColorComponent(this.controlEl);
        this.components.push(colorComponent);
        cb(colorComponent);
        return this;
    }
    addSearch(cb) {
        const searchComponent = new TextComponent(this.controlEl);
        this.components.push(searchComponent);
        cb(searchComponent);
        return this;
    }
    addMomentFormat(cb) {
        const momentComponent = new TextComponent(this.controlEl);
        this.components.push(momentComponent);
        cb(momentComponent);
        return this;
    }
    addProgressBar() {
        return this;
    }
    clear() {
        this.components = [];
        this.controlEl.empty();
        return this;
    }
    then(cb) {
        cb(this);
        return this;
    }
}
