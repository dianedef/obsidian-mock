import { Events } from '../components/events';
export class TextComponent extends Events {
    constructor(containerEl) {
        super();
        this.disabled = false;
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
        containerEl.appendChild(this.inputEl);
        this.inputEl.addEventListener('input', this.onChanged.bind(this));
    }
    getValue() {
        return this.inputEl.value;
    }
    setValue(value) {
        this.inputEl.value = value;
        return this;
    }
    setPlaceholder(placeholder) {
        this.inputEl.placeholder = placeholder;
        return this;
    }
    onChanged() {
        const value = this.getValue();
        this.trigger('change', value);
    }
    onChange(callback) {
        this.on('change', callback);
        return this;
    }
    setDisabled(disabled) {
        this.disabled = disabled;
        this.inputEl.disabled = disabled;
        return this;
    }
    then(cb) {
        cb(this);
        return this;
    }
    registerOptionListener(listeners, key) {
        this.on('change', () => {
            const value = this.getValue();
            if (listeners[key]) {
                listeners[key](value);
            }
        });
        return this;
    }
}
export class TextAreaComponent extends Events {
    constructor(containerEl) {
        super();
        this.disabled = false;
        this.inputEl = document.createElement('textarea');
        containerEl.appendChild(this.inputEl);
        this.inputEl.addEventListener('input', this.onChanged.bind(this));
    }
    getValue() {
        return this.inputEl.value;
    }
    setValue(value) {
        this.inputEl.value = value;
        return this;
    }
    setPlaceholder(placeholder) {
        this.inputEl.placeholder = placeholder;
        return this;
    }
    onChanged() {
        const value = this.getValue();
        this.trigger('change', value);
    }
    onChange(callback) {
        this.on('change', callback);
        return this;
    }
    setDisabled(disabled) {
        this.disabled = disabled;
        this.inputEl.disabled = disabled;
        return this;
    }
    then(cb) {
        cb(this);
        return this;
    }
    registerOptionListener(listeners, key) {
        this.on('change', () => {
            const value = this.getValue();
            if (listeners[key]) {
                listeners[key](value);
            }
        });
        return this;
    }
}
