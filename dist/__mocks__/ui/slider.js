import { vi } from 'vitest';
export class SliderComponent {
    constructor(containerEl) {
        this.disabled = false;
        this.changeCallback = null;
        this.instant = false;
        this.getValuePretty = vi.fn().mockImplementation(() => {
            return this.getValue().toString();
        });
        this.setDynamicTooltip = vi.fn().mockImplementation(() => {
            this.sliderEl.title = this.getValuePretty();
            return this;
        });
        this.showTooltip = vi.fn().mockImplementation(() => {
            this.setDynamicTooltip();
        });
        this.sliderEl = document.createElement('input');
        this.sliderEl.type = 'range';
        this.sliderEl.className = 'slider';
        containerEl.appendChild(this.sliderEl);
        this.sliderEl.addEventListener('input', () => {
            if (this.instant) {
                this.onChanged();
            }
        });
        this.sliderEl.addEventListener('change', this.onChanged.bind(this));
    }
    getValue() {
        return Number(this.sliderEl.value);
    }
    setValue(value) {
        this.sliderEl.value = String(value);
        if (this.changeCallback) {
            this.changeCallback(value);
        }
        return this;
    }
    setDisabled(disabled) {
        this.disabled = disabled;
        this.sliderEl.disabled = disabled;
        return this;
    }
    setLimits(min, max, step) {
        this.sliderEl.min = String(min);
        this.sliderEl.max = String(max);
        this.sliderEl.step = String(step);
        return this;
    }
    setInstant(instant) {
        this.instant = instant;
        return this;
    }
    onChanged() {
        const value = this.getValue();
        if (this.changeCallback) {
            this.changeCallback(value);
        }
    }
    onChange(callback) {
        this.changeCallback = callback;
        return this;
    }
    registerOptionListener(listeners, key) {
        this.onChange((value) => {
            if (listeners[key]) {
                return listeners[key](value);
            }
            return value;
        });
        return this;
    }
    then(cb) {
        cb(this);
        return this;
    }
}
