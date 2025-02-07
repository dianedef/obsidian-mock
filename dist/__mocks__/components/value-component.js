import { vi } from 'vitest';
import { BaseComponent } from './base-component';
export class ValueComponent extends BaseComponent {
    constructor(value) {
        super();
        this.containerEl = document.createElement('div');
        // Component methods
        this.load = vi.fn();
        this.onload = vi.fn();
        this.unload = vi.fn();
        this.onunload = vi.fn();
        this.addChild = vi.fn().mockImplementation((component) => component);
        this.removeChild = vi.fn().mockImplementation((component) => component);
        this.register = vi.fn();
        this.registerEvent = vi.fn();
        this.registerDomEvent = vi.fn().mockImplementation((el, event, callback) => {
            el.addEventListener(event, callback);
            return { el, event, callback };
        });
        this.registerInterval = vi.fn().mockReturnValue(0);
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = value;
        return this;
    }
    getContainerEl() {
        return this.containerEl;
    }
    registerOptionListener(listeners, key) {
        const listener = listeners[key];
        if (listener) {
            this.registerEvent(this.register(() => {
                const value = listener(this.getValue());
                if (value !== undefined) {
                    this.setValue(value);
                }
            }));
        }
        return this;
    }
}
