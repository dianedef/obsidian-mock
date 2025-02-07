import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ValueComponent } from '../../__mocks__/components/value-component';

class TestValueComponent extends ValueComponent<string> {
    constructor(value: string = '') {
        super(value);
    }
}

describe('ValueComponent', () => {
    let component: TestValueComponent;

    beforeEach(() => {
        component = new TestValueComponent('test');
    });

    describe('Gestion des valeurs', () => {
        it('devrait initialiser avec une valeur', () => {
            expect(component.getValue()).toBe('test');
        });

        it('devrait permettre de mettre à jour la valeur', () => {
            component.setValue('new value');
            expect(component.getValue()).toBe('new value');
        });

        it('devrait retourner this pour le chaînage', () => {
            const result = component.setValue('test');
            expect(result).toBe(component);
        });
    });

    describe('Méthodes de composant', () => {
        it('devrait avoir un conteneur DOM', () => {
            const container = component.getContainerEl();
            expect(container).toBeInstanceOf(HTMLElement);
        });

        it('devrait gérer les événements DOM', () => {
            const callback = vi.fn();
            const el = document.createElement('button');
            component.registerDomEvent(el, 'click', callback);
            
            el.click();
            expect(callback).toHaveBeenCalled();
        });

        it('devrait permettre d\'ajouter et retirer des enfants', () => {
            const child = new TestValueComponent();
            const addedChild = component.addChild(child);
            expect(addedChild).toBe(child);

            const removedChild = component.removeChild(child);
            expect(removedChild).toBe(child);
        });
    });

    describe('Gestion des options', () => {
        it('devrait permettre d\'enregistrer des écouteurs d\'options', () => {
            const listeners = {
                'test': (value?: string) => value?.toUpperCase() || ''
            };

            component.registerOptionListener(listeners, 'test');
            component.setValue('hello');
            
            // Simuler le déclenchement de l'écouteur
            const registeredCallback = vi.mocked(component.register).mock.calls[0][0];
            registeredCallback();
            
            expect(component.getValue()).toBe('HELLO');
        });

        it('devrait ignorer les écouteurs inexistants', () => {
            const listeners = {
                'other': (value?: string) => value?.toUpperCase() || ''
            };

            const result = component.registerOptionListener(listeners, 'nonexistent');
            expect(result).toBe(component);
        });

        it('devrait permettre le chaînage des écouteurs', () => {
            const listeners = {
                'test': (value?: string) => value?.toUpperCase() || ''
            };

            const result = component.registerOptionListener(listeners, 'test');
            expect(result).toBe(component);
        });
    });
}); 