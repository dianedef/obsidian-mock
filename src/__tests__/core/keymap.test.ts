import { describe, it, expect, beforeEach } from 'vitest';
import { Keymap } from '../../__mocks__/core/keymap';

describe('Keymap', () => {
    let keymap: Keymap;

    beforeEach(() => {
        keymap = new Keymap();
    });

    describe('Modifier Management', () => {
        it('should correctly detect modifiers', () => {
            const mockEvent = new KeyboardEvent('keydown', {
                ctrlKey: true,
                metaKey: false,
                shiftKey: false,
                altKey: false
            });

            expect(keymap.isModifier(mockEvent, 'Mod')).toBe(true);
            expect(keymap.isModifier(mockEvent, 'Ctrl')).toBe(true);
            expect(keymap.isModifier(mockEvent, 'Meta')).toBe(false);
            expect(keymap.isModifier(mockEvent, 'Shift')).toBe(false);
            expect(keymap.isModifier(mockEvent, 'Alt')).toBe(false);
        });

        it('should correctly check modifier combinations', () => {
            const mockEvent = new KeyboardEvent('keydown', {
                ctrlKey: true,
                shiftKey: true,
                altKey: false,
                metaKey: false
            });

            expect(keymap.checkModifiers(mockEvent, ['Ctrl', 'Shift'])).toBe(true);
            expect(keymap.checkModifiers(mockEvent, ['Ctrl', 'Alt'])).toBe(false);
            expect(keymap.checkModifiers(mockEvent, ['Meta'])).toBe(false);
        });
    });

    describe('Scope Management', () => {
        const mockScope = { keys: new Map() };

        it('should be able to manage scopes', () => {
            keymap.pushScope(mockScope);
            expect(keymap.pushScope).toHaveBeenCalledWith(mockScope);

            keymap.popScope(mockScope);
            expect(keymap.popScope).toHaveBeenCalledWith(mockScope);
        });
    });

    describe('Event Management', () => {
        it('should have event handlers', () => {
            const mockEvent = new KeyboardEvent('keydown');
            
            keymap.onTrigger(mockEvent);
            expect(keymap.onTrigger).toHaveBeenCalledWith(mockEvent);

            keymap.onRelease(mockEvent);
            expect(keymap.onRelease).toHaveBeenCalledWith(mockEvent);
        });
    });
}); 