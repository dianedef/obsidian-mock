import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ValueComponent } from '../../__mocks__/components/value-component';

interface ChangeEvent<T> {
    oldValue: T;
    value: T;
    component: ValueComponent<T>;
}

interface BeforeChangeEvent<T> extends ChangeEvent<T> {
    cancelled: boolean;
}

class TestValueComponent extends ValueComponent<string> {}

describe('ValueComponent', () => {
    describe('Value Management', () => {
        it('should initialize with a value', () => {
            const component = new TestValueComponent('test');
            expect(component.getValue()).toBe('test');
        });

        it('should allow updating the value', () => {
            const component = new TestValueComponent('test');
            component.setValue('new value');
            expect(component.getValue()).toBe('new value');
        });

        it('should return this for chaining', () => {
            const component = new TestValueComponent('test');
            expect(component.setValue('new value')).toBe(component);
        });
    });

    describe('Advanced Value Management', () => {
        it('should handle null and undefined values', () => {
            const component = new TestValueComponent('test');
            component.setValue(null as any);
            expect(component.getValue()).toBe(null);

            component.setValue(undefined as any);
            expect(component.getValue()).toBe(undefined);
        });

        it('should emit events on value changes', () => {
            const component = new TestValueComponent('test');
            let oldValue: string | null = null;
            let newValue: string | null = null;

            component.on('change', (evt: ChangeEvent<string>) => {
                oldValue = evt.oldValue;
                newValue = evt.value;
            });

            component.setValue('new value');
            expect(oldValue).toBe('test');
            expect(newValue).toBe('new value');
        });

        it('should allow canceling value changes', () => {
            const component = new TestValueComponent('test');

            component.on('beforeChange', (evt: BeforeChangeEvent<string>) => {
                if (evt.value === 'invalid') {
                    evt.cancelled = true;
                }
            });

            component.setValue('invalid');
            expect(component.getValue()).toBe('test');

            component.setValue('valid');
            expect(component.getValue()).toBe('valid');
        });
    });

    describe('Validation', () => {
        it('should allow defining validation rules', () => {
            const component = new TestValueComponent('test');
            component.addValidationRule(value => {
                return value.length >= 3 || 'The value must contain at least 3 characters';
            });

            expect(component.validate('ab')).toBe(false);
            expect(component.getValidationErrors()).toContain('The value must contain at least 3 characters');

            expect(component.validate('abc')).toBe(true);
            expect(component.getValidationErrors()).toHaveLength(0);
        });

        it('should allow defining multiple validation rules', () => {
            const component = new TestValueComponent('test');
            component.addValidationRule(value => {
                return value.length >= 3 || 'The value must contain at least 3 characters';
            });
            component.addValidationRule(value => {
                return /^[a-zA-Z]+$/.test(value) || 'The value should only contain letters';
            });

            expect(component.validate('a1')).toBe(false);
            expect(component.getValidationErrors()).toHaveLength(2);

            expect(component.validate('abc')).toBe(true);
            expect(component.getValidationErrors()).toHaveLength(0);
        });

        it('should automatically validate on value changes', () => {
            const component = new TestValueComponent('test');
            component.addValidationRule(value => {
                return value.length >= 3 || 'The value must contain at least 3 characters';
            });

            component.setAutoValidate(true);
            component.setValue('ab');

            expect(component.hasErrors()).toBe(true);
            expect(component.getValidationErrors()).toHaveLength(1);
        });
    });

    describe('Component Methods', () => {
        it('should handle the disabled state', () => {
            const component = new TestValueComponent('test');
            expect(component.isDisabled()).toBe(false);

            component.setDisabled(true);
            expect(component.isDisabled()).toBe(true);
        });

        it('should handle the focus state', () => {
            const component = new TestValueComponent('test');
            expect(component.isFocused()).toBe(false);

            component.focus();
            expect(component.isFocused()).toBe(true);

            component.blur();
            expect(component.isFocused()).toBe(false);
        });

        it('should handle the modification state', () => {
            const component = new TestValueComponent('test');
            expect(component.isModified()).toBe(false);

            component.setValue('new value');
            expect(component.isModified()).toBe(true);

            component.resetModified();
            expect(component.isModified()).toBe(false);
        });
    });

    describe('Value Formatting', () => {
        it('should allow defining a value formatter', () => {
            const component = new TestValueComponent('test');
            component.setValueFormatter(value => value.toUpperCase());

            component.setValue('test');
            expect(component.getValue()).toBe('TEST');
        });

        it('should allow defining a value parser', () => {
            const component = new TestValueComponent('test');
            component.setValueParser(value => value.toUpperCase());

            component.setValueFromString('test');
            expect(component.getValue()).toBe('TEST');
        });

        it('should combine formatting and parsing', () => {
            const component = new TestValueComponent('test');
            component.setValueFormatter(value => value.toUpperCase());
            component.setValueParser(value => value.toLowerCase());

            component.setValueFromString('TEST');
            expect(component.getValue()).toBe('TEST');

            const displayValue = component.getDisplayValue();
            expect(displayValue).toBe('TEST');
        });
    });

    describe('Dependency Management', () => {
        it('should allow defining dependencies', () => {
            const component = new TestValueComponent('test');
            const dependentComponent = new TestValueComponent('');

            component.addDependency(dependentComponent, value => {
                dependentComponent.setValue(value + ' modified');
            });

            component.setValue('test');
            expect(dependentComponent.getValue()).toBe('test modified');
        });

        it('should allow removing dependencies', () => {
            const component = new TestValueComponent('test');
            const dependentComponent = new TestValueComponent('');

            component.addDependency(dependentComponent, value => {
                dependentComponent.setValue(value + ' modified');
            });

            component.removeDependency(dependentComponent);
            component.setValue('test');
            expect(dependentComponent.getValue()).toBe('');
        });

        it('should avoid dependency loops', () => {
            const component = new TestValueComponent('test');
            const dependentComponent = new TestValueComponent('');

            component.addDependency(dependentComponent, value => {
                dependentComponent.setValue(value + '1');
            });

            dependentComponent.addDependency(component, value => {
                component.setValue(value + '2');
            });

            component.setValue('test');
            expect(component.getValue()).toBe('test');
            expect(dependentComponent.getValue()).toBe('test1');
        });
    });

    describe('Lifecycle', () => {
        it('should handle loading', () => {
            const component = new TestValueComponent('test');
            let loaded = false;
            
            component.on('load', () => loaded = true);
            
            component.load();
            
            expect(loaded).toBe(true);
        });

        it('should handle unloading', () => {
            const component = new TestValueComponent('test');
            let unloaded = false;
            component.on('unload', () => unloaded = true);
            component.load();
            component.unload();
            expect(unloaded).toBe(true);
        });
    });
}); 