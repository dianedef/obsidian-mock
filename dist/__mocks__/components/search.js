import { vi } from 'vitest';
export class MockSearchComponent {
    constructor(containerEl) {
        this.disabled = false;
        this.onChangeCallback = null;
        this.getValue = vi.fn().mockImplementation(() => {
            return this.inputEl.value;
        });
        this.setValue = vi.fn().mockImplementation((value) => {
            this.inputEl.value = value;
            this.onChanged();
            return this;
        });
        this.setPlaceholder = vi.fn().mockImplementation((placeholder) => {
            this.inputEl.placeholder = placeholder;
            return this;
        });
        this.onChanged = vi.fn().mockImplementation(() => {
            const value = this.getValue();
            this.onChangeCallback?.(value);
            this.clearButtonEl.style.display = value ? 'block' : 'none';
        });
        this.onChange = vi.fn().mockImplementation((callback) => {
            this.onChangeCallback = callback;
            return this;
        });
        this.clear = vi.fn().mockImplementation(() => {
            this.setValue('');
        });
        this.setDisabled = vi.fn().mockImplementation((disabled) => {
            this.disabled = disabled;
            this.inputEl.disabled = disabled;
            return this;
        });
        this.registerOptionListener = vi.fn().mockImplementation((listeners, key) => {
            const listener = listeners[key];
            if (listener) {
                this.onChange((value) => {
                    const newValue = listener(value);
                    if (newValue !== undefined) {
                        this.setValue(newValue);
                    }
                });
            }
            return this;
        });
        this.then = vi.fn().mockImplementation((cb) => {
            cb(this);
            return this;
        });
        this.inputEl = document.createElement('input');
        this.inputEl.type = 'search';
        this.inputEl.addClass('search-input');
        containerEl.appendChild(this.inputEl);
        this.clearButtonEl = document.createElement('button');
        this.clearButtonEl.addClass('search-clear-button');
        this.clearButtonEl.setAttribute('aria-label', 'Clear search');
        containerEl.appendChild(this.clearButtonEl);
        this.inputEl.addEventListener('input', () => {
            this.onChanged();
        });
        this.clearButtonEl.addEventListener('click', () => {
            this.clear();
        });
    }
}
