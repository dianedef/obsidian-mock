import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExtraButtonComponent } from '../../__mocks__/ui/extra-button-component';
import '../helpers/dom-extensions';

// Extension of HTMLElement to simulate Obsidian methods
declare global {
    interface HTMLElement {
        createDiv(className?: string): HTMLDivElement;
    }
}

// Implementation of createDiv
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

    describe('Constructor', () => {
        it('should create an extraSettingsEl element with the appropriate class', () => {
            expect(component.extraSettingsEl).toBeInstanceOf(HTMLElement);
            expect(component.extraSettingsEl.classList.contains('extra-settings-button')).toBe(true);
            expect(containerEl.contains(component.extraSettingsEl)).toBe(true);
        });
    });

    describe('setDisabled', () => {
        it('should update the disabled property and add/remove the appropriate class', () => {
            component.setDisabled(true);
            expect(component.disabled).toBe(true);
            expect(component.extraSettingsEl.classList.contains('is-disabled')).toBe(true);

            component.setDisabled(false);
            expect(component.disabled).toBe(false);
            expect(component.extraSettingsEl.classList.contains('is-disabled')).toBe(false);
        });

        it('should return this for chaining', () => {
            const result = component.setDisabled(true);
            expect(result).toBe(component);
        });
    });

    describe('setTooltip', () => {
        it('should set the aria-label attribute', () => {
            const tooltip = 'Test tooltip';
            component.setTooltip(tooltip);
            expect(component.extraSettingsEl.getAttribute('aria-label')).toBe(tooltip);
        });

        it('should return this for chaining', () => {
            const result = component.setTooltip('test');
            expect(result).toBe(component);
        });

        it('should handle tooltip options', () => {
            const tooltip = 'Test tooltip';
            const options = { delay: 300 };
            component.setTooltip(tooltip, options);
            expect(component.extraSettingsEl.getAttribute('aria-label')).toBe(tooltip);
        });
    });

    describe('setIcon', () => {
        it('should add the appropriate icon class', () => {
            const icon = 'settings';
            component.setIcon(icon);
            expect(component.extraSettingsEl.classList.contains(`${icon}-icon`)).toBe(true);
        });

        it('should return this for chaining', () => {
            const result = component.setIcon('settings');
            expect(result).toBe(component);
        });
    });

    describe('onClick', () => {
        it('should allow adding a click handler', () => {
            const callback = vi.fn();
            const result = component.onClick(callback);

            // Simulate a click
            const event = new MouseEvent('click');
            component.extraSettingsEl.dispatchEvent(event);

            expect(callback).toHaveBeenCalledWith(event);
            expect(result).toBe(component);
        });

        it('should return this for chaining', () => {
            const result = component.onClick(() => {});
            expect(result).toBe(component);
        });

        it('should allow multiple listeners', () => {
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            component.onClick(callback1);
            component.onClick(callback2);

            // Simulate a click
            component.extraSettingsEl.click();
            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });
    });

    describe('Method Chaining', () => {
        it('should allow chaining of all methods', () => {
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

            // Verify that the callback is registered
            component.extraSettingsEl.click();
            expect(callback).toHaveBeenCalled();
        });
    });
}); 
