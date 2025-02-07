import { MockComponent } from './component';
export class MockMomentFormatComponent extends MockComponent {
    constructor() {
        super();
        this.disabled = false;
        this.defaultFormat = 'YYYY-MM-DD';
        this.value = '';
        this.changeCallback = () => { };
        this.optionListeners = {};
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'text';
        this.inputEl.placeholder = this.defaultFormat;
        this.sampleEl = document.createElement('div');
        this.sampleEl.addClass('moment-format-sample');
        this.inputEl.addEventListener('input', () => {
            this.value = this.inputEl.value;
            this.onChanged();
            this.changeCallback?.(this.value);
        });
    }
    then(cb) {
        cb(this);
        return this;
    }
    setDefaultFormat(defaultFormat) {
        this.defaultFormat = defaultFormat;
        this.inputEl.placeholder = defaultFormat;
        this.updateSample();
        return this;
    }
    setSampleEl(sampleEl) {
        this.sampleEl = sampleEl;
        this.updateSample();
        return this;
    }
    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = value;
        this.inputEl.value = value;
        this.updateSample();
        return this;
    }
    setDisabled(disabled) {
        this.disabled = disabled;
        this.inputEl.disabled = disabled;
        return this;
    }
    setPlaceholder(placeholder) {
        this.inputEl.placeholder = placeholder;
        return this;
    }
    onChanged() {
        this.updateSample();
    }
    onChange(callback) {
        this.changeCallback = callback;
        return this;
    }
    updateSample() {
        const format = this.value || this.defaultFormat;
        const now = new Date();
        this.sampleEl.setText(now.toLocaleDateString());
    }
    registerOptionListener(listeners, key) {
        this.optionListeners = { ...this.optionListeners, ...listeners };
        return this;
    }
}
