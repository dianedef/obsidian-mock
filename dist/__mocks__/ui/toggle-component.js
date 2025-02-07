export class ToggleComponent {
    constructor(containerEl) {
        this.disabled = false;
        this.clickCallback = null;
        this.changeCallback = null;
        this.toggleEl = document.createElement('div');
        this.toggleEl.className = 'checkbox-container';
        containerEl.appendChild(this.toggleEl);
        this.toggleEl.addEventListener('click', this.handleClick.bind(this));
    }
    getValue() {
        return this.toggleEl.classList.contains('is-enabled');
    }
    setValue(value) {
        this.toggleEl.classList.toggle('is-enabled', value);
        if (this.changeCallback) {
            this.changeCallback(value);
        }
        return this;
    }
    setDisabled(disabled) {
        this.disabled = disabled;
        this.toggleEl.classList.toggle('is-disabled', disabled);
        return this;
    }
    setTooltip(tooltip) {
        this.toggleEl.setAttribute('aria-label', tooltip);
        return this;
    }
    onClick() {
        if (!this.disabled && this.clickCallback) {
            const newValue = !this.getValue();
            this.setValue(newValue);
            this.clickCallback(newValue);
        }
    }
    onChange(callback) {
        this.changeCallback = callback;
        return this;
    }
    registerOptionListener(listeners, key) {
        this.onChange((value) => {
            if (listeners[key]) {
                listeners[key](value);
            }
            return value;
        });
        return this;
    }
    handleClick() {
        this.onClick();
    }
    then(cb) {
        cb(this);
        return this;
    }
}
