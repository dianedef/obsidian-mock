import { vi } from 'vitest';
import { BaseComponent } from './base-component';
import { Events } from './events';
import type { Component } from 'obsidian';

export class ValueComponent<T> extends BaseComponent {
    protected value: T;
    protected initialValue: T;
    protected id: string;
    protected dependentComponents: Map<string, { component: ValueComponent<any>, callback: (value: T) => void }> = new Map();
    protected dependencyStack: Set<string> = new Set();
    protected valueFormatter: ((value: T) => T) | null = null;
    protected valueParser: ((value: string) => T) | null = null;
    protected validationRules: Array<(value: T) => true | string> = [];
    protected validationErrors: string[] = [];
    protected autoValidate: boolean = false;
    protected isFocusedState: boolean = false;
    protected isDisabledState: boolean = false;
    protected isLoaded: boolean = false;

    constructor(value: T) {
        super();
        this.value = value;
        this.initialValue = value;
        this.id = Math.random().toString(36).substring(7);
    }

    getValue(): T {
        return this.value;
    }

    setValue(value: T, emitEvent: boolean = true): this {
        if (!this.isLoaded) {
            this.load();
        }

        if (this.dependencyStack.has(this.id)) {
            return this;
        }
        
        this.dependencyStack.add(this.id);
        const oldValue = this.value;
        let shouldUpdate = true;

        if (emitEvent) {
            const evt = { value, oldValue, component: this, cancelled: false };
            this.trigger('beforeChange', evt);
            shouldUpdate = !evt.cancelled;
        }

        if (shouldUpdate) {
            // Format the value first
            const formattedValue = this.valueFormatter ? this.valueFormatter(value) : value;
            
            // Validate if auto-validate is enabled
            if (this.autoValidate && !this.validateAndUpdate(formattedValue)) {
                this.dependencyStack.delete(this.id);
                return this;
            }
            
            // Update the value
            this.value = formattedValue;

            if (emitEvent) {
                this.trigger('change', { value: formattedValue, oldValue, component: this });
            }
            
            // Update dependent components
            this.updateDependentComponents(formattedValue);
        }
        
        this.dependencyStack.delete(this.id);
        return this;
    }

    protected updateDependentComponents(value: T): void {
        for (const { component, callback } of this.dependentComponents.values()) {
            if (!this.dependencyStack.has(component.id)) {
                try {
                    callback.call(component, value);
                } catch (e) {
                    console.error('Error updating dependent component:', e);
                }
            }
        }
    }

    protected validateAndUpdate(value: T): boolean {
        this.validationErrors = [];
        
        for (const rule of this.validationRules) {
            const result = rule(value);
            if (result !== true) {
                this.validationErrors.push(result);
            }
        }
        
        const isValid = this.validationErrors.length === 0;
        
        if (!isValid) {
            this.trigger('validation-error', this.validationErrors);
        }
        
        return isValid;
    }

    // Méthodes de cycle de vie
    load(): void {
        if (this.isLoaded) return;
        
        // Set loaded state first
        this.isLoaded = true;
        
        // Initialize with current value
        if (this.autoValidate) {
            this.validateAndUpdate(this.value);
        }
        
        // Load base component
        super.load();
        
        // Trigger load event
        this.trigger('load');
    }

    unload(): void {
        if (!this.isLoaded) return;
        
        // Trigger unload event first
        this.trigger('unload');
        
        // Clear all dependencies
        this.dependentComponents.clear();
        this.dependencyStack.clear();
        
        // Reset validation state
        this.validationErrors = [];
        this.validationRules = [];
        this.autoValidate = false;
        
        // Reset value state
        this.value = this.initialValue;
        this.valueFormatter = null;
        this.valueParser = null;
        
        // Reset UI state
        this.isFocusedState = false;
        this.isDisabledState = false;
        
        // Set loaded state
        this.isLoaded = false;
        
        // Unload base component last
        super.unload();
    }

    // Méthodes de composant
    addChild = vi.fn().mockImplementation(<C extends Component>(component: C): C => component);
    removeChild = vi.fn().mockImplementation(<C extends Component>(component: C): C => component);
    register = vi.fn();
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
            const callback = () => {
                const value = listener(this.getValue());
                if (value !== undefined) {
                    this.setValue(value);
                }
            };
            this.register(callback);
        }
        return this;
    }

    addDependency(component: ValueComponent<any>, callback: (value: T) => void): this {
        if (!this.isLoaded) {
            this.load();
        }
        this.dependentComponents.set(component.id, { component, callback });
        return this;
    }

    removeDependency(component: ValueComponent<any>): this {
        this.dependentComponents.delete(component.id);
        return this;
    }

    onDependencyChanged(dependency: ValueComponent<any>): void {
        if (this.dependencyStack.has(this.id)) {
            return;
        }
        
        const newValue = this.formatValue(dependency.getValue());
        this.setValue(newValue);
    }

    formatValue(value: any): T {
        return this.valueFormatter ? this.valueFormatter(value) : value;
    }

    setValueFormatter(formatter: (value: T) => T): this {
        this.valueFormatter = formatter;
        return this;
    }

    setValueParser(parser: (value: string) => T): this {
        this.valueParser = parser;
        return this;
    }

    setValueFromString(value: string): this {
        if (!this.isLoaded) {
            this.load();
        }

        if (this.valueParser) {
            const parsedValue = this.valueParser(value);
            return this.setValue(parsedValue);
        }
        return this.setValue(value as unknown as T);
    }

    getDisplayValue(): string {
        const value = this.getValue();
        return value !== null && value !== undefined ? String(value) : '';
    }

    addValidationRule(rule: (value: T) => true | string): this {
        this.validationRules.push(rule);
        return this;
    }

    validate(value: T = this.value): boolean {
        this.validationErrors = [];
        for (const rule of this.validationRules) {
            const result = rule(value);
            if (result !== true) {
                this.validationErrors.push(result);
            }
        }
        return this.validationErrors.length === 0;
    }

    getValidationErrors(): string[] {
        return this.validationErrors;
    }

    hasErrors(): boolean {
        return this.validationErrors.length > 0;
    }

    setAutoValidate(autoValidate: boolean): this {
        this.autoValidate = autoValidate;
        return this;
    }

    isModified(): boolean {
        const currentValue = this.getValue();
        return currentValue !== this.initialValue;
    }

    resetModified(): this {
        this.initialValue = this.getValue();
        return this;
    }

    focus(): this {
        this.isFocusedState = true;
        this.trigger('focus');
        return this;
    }

    blur(): this {
        this.isFocusedState = false;
        this.trigger('blur');
        return this;
    }

    isFocused(): boolean {
        return this.isFocusedState;
    }

    setDisabled(disabled: boolean): this {
        this.isDisabledState = disabled;
        if (disabled) {
            this.containerEl.classList.add('is-disabled');
        } else {
            this.containerEl.classList.remove('is-disabled');
        }
        return this;
    }

    isDisabled(): boolean {
        return this.isDisabledState;
    }

    // Override Events methods to handle component lifecycle
    on(name: string, callback: Function, ctx?: any): IEventRef {
        const ref = super.on(name, callback, ctx);
        
        // Si on s'abonne à l'événement load et que le composant est déjà chargé,
        // déclencher immédiatement le callback
        if (name === 'load' && this.isLoaded) {
            callback.call(ctx || this);
        }
        
        return ref;
    }
} 