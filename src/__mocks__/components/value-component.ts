import { vi } from 'vitest';
import { BaseComponent } from './base-component';

export abstract class ValueComponent<T> extends BaseComponent {
    protected containerEl: HTMLElement = document.createElement('div');
    protected value: T;

    constructor(value: T) {
        super();
        this.value = value;
    }

    getValue(): T {
        return this.value;
    }

    setValue(value: T): this {
        this.value = value;
        return this;
    }

    // Component methods
    load = vi.fn();
    onload = vi.fn();
    unload = vi.fn();
    onunload = vi.fn();
    
    addChild = vi.fn().mockImplementation(<C extends Component>(component: C): C => component);
    removeChild = vi.fn().mockImplementation(<C extends Component>(component: C): C => component);
    register = vi.fn();
    registerEvent = vi.fn();
    registerDomEvent = vi.fn().mockImplementation((el: HTMLElement, event: string, callback: (evt: Event) => void) => {
        el.addEventListener(event, callback);
        return { el, event, callback };
    });
    registerInterval = vi.fn().mockReturnValue(0);

    getContainerEl(): HTMLElement {
        return this.containerEl;
    }

    registerOptionListener(listeners: Record<string, (value?: T) => T>, key: string): this {
        const listener = listeners[key];
        if (listener) {
            this.registerEvent(
                this.register(() => {
                    const value = listener(this.getValue());
                    if (value !== undefined) {
                        this.setValue(value);
                    }
                })
            );
        }
        return this;
    }
} 