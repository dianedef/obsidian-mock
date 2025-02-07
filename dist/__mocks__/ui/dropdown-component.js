import { BaseComponent } from '../components/component';
/**
 * Dropdown component mock
 * @public
 */
export class DropdownComponent extends BaseComponent {
    constructor(containerEl) {
        super();
        this.disabled = false;
        this.selectEl = containerEl.createEl('select');
    }
    /**
     * @public
     */
    addOption(value, display) {
        const option = this.selectEl.createEl('option');
        option.value = value;
        option.text = display;
        return this;
    }
    /**
     * @public
     */
    addOptions(options) {
        for (const [value, display] of Object.entries(options)) {
            this.addOption(value, display);
        }
        return this;
    }
    /**
     * @public
     */
    getValue() {
        return this.selectEl.value;
    }
    /**
     * @public
     */
    setValue(value) {
        this.selectEl.value = value;
        return this;
    }
    /**
     * @public
     */
    onChange(callback) {
        this.selectEl.addEventListener('change', () => {
            callback(this.getValue());
        });
        return this;
    }
    /**
     * @public
     */
    setDisabled(disabled) {
        this.disabled = disabled;
        this.selectEl.disabled = disabled;
        return this;
    }
    then(cb) {
        cb(this);
        return this;
    }
    registerOptionListener(listeners, key) {
        this.selectEl.addEventListener('change', () => {
            const value = this.getValue();
            if (listeners[key]) {
                listeners[key](value);
            }
        });
        return this;
    }
}
