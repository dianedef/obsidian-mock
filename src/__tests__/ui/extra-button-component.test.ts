import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExtraButtonComponent } from '../../__mocks__/ui/extra-button-component';
import '../helpers/dom-extensions';

// Extension de HTMLElement pour simuler les méthodes d'Obsidian
declare global {
    interface HTMLElement {
        createDiv(className?: string): HTMLDivElement;
    }
}

// Implémentation de createDiv
HTMLElement.prototype.createDiv = function(className?: string): HTMLDivElement {
    const div = document.createElement('div');
    if (className) {
        div.className = className;
    }
    this.appendChild(div);
    return div;
};

describe('ExtraButtonComponent', () => {
    let containerEl: HTMLElement;
    let component: ExtraButtonComponent;

    beforeEach(() => {
        containerEl = document.createElement('div');
        component = new ExtraButtonComponent(containerEl);
    });

    describe('Constructeur', () => {
        it('devrait créer un élément extraSettingsEl avec la classe appropriée', () => {
            expect(component.extraSettingsEl).toBeInstanceOf(HTMLElement);
            expect(component.extraSettingsEl.classList.contains('extra-settings-button')).toBe(true);
            expect(containerEl.contains(component.extraSettingsEl)).toBe(true);
        });
    });

    describe('setDisabled', () => {
        it('devrait mettre à jour la propriété disabled et ajouter/supprimer la classe appropriée', () => {
            component.setDisabled(true);
            expect(component.disabled).toBe(true);
            expect(component.extraSettingsEl.classList.contains('is-disabled')).toBe(true);

            component.setDisabled(false);
            expect(component.disabled).toBe(false);
            expect(component.extraSettingsEl.classList.contains('is-disabled')).toBe(false);
        });

        it('devrait retourner this pour le chaînage', () => {
            const result = component.setDisabled(true);
            expect(result).toBe(component);
        });
    });

    describe('setTooltip', () => {
        it('devrait définir l\'attribut aria-label', () => {
            const tooltip = 'Test tooltip';
            component.setTooltip(tooltip);
            expect(component.extraSettingsEl.getAttribute('aria-label')).toBe(tooltip);
        });

        it('devrait retourner this pour le chaînage', () => {
            const result = component.setTooltip('test');
            expect(result).toBe(component);
        });

        it('devrait gérer les options de tooltip', () => {
            const tooltip = 'Test tooltip';
            const options = { delay: 300 };
            component.setTooltip(tooltip, options);
            expect(component.extraSettingsEl.getAttribute('aria-label')).toBe(tooltip);
        });
    });

    describe('setIcon', () => {
        it('devrait ajouter la classe d\'icône appropriée', () => {
            const icon = 'settings';
            component.setIcon(icon);
            expect(component.extraSettingsEl.classList.contains(`${icon}-icon`)).toBe(true);
        });

        it('devrait retourner this pour le chaînage', () => {
            const result = component.setIcon('settings');
            expect(result).toBe(component);
        });
    });

    describe('onClick', () => {
        it('devrait permettre d\'ajouter un gestionnaire de clic', () => {
            const callback = vi.fn();
            const result = component.onClick(callback);

            // Simuler un clic
            const event = new MouseEvent('click');
            component.extraSettingsEl.dispatchEvent(event);

            expect(callback).toHaveBeenCalledWith(event);
            expect(result).toBe(component);
        });

        it('devrait retourner this pour le chaînage', () => {
            const result = component.onClick(() => {});
            expect(result).toBe(component);
        });

        it('devrait permettre plusieurs écouteurs', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            component.onClick(callback1);
            component.onClick(callback2);

            // Simuler un clic
            component.extraSettingsEl.click();
            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });
    });

    describe('Chaînage des méthodes', () => {
        it('devrait permettre le chaînage de toutes les méthodes', () => {
            const callback = vi.fn();
            
            component
                .setDisabled(true)
                .setTooltip('test tooltip')
                .setIcon('settings')
                .onClick(callback)
                .setDisabled(false);

            expect(component.disabled).toBe(false);
            expect(component.extraSettingsEl.getAttribute('aria-label')).toBe('test tooltip');
            expect(component.extraSettingsEl.classList.contains('settings-icon')).toBe(true);

            // Vérifier que le callback est bien enregistré
            component.extraSettingsEl.click();
            expect(callback).toHaveBeenCalled();
        });
    });
}); 
