import { vi } from 'vitest';
import type { Keymap as IKeymap, KeymapEventHandler, KeymapContext, Modifier } from 'obsidian';

export class Keymap implements IKeymap {
    private keymaps: Map<string, KeymapEventHandler> = new Map();

    pushScope = vi.fn();
    popScope = vi.fn();

    isModifier = vi.fn().mockImplementation((evt: KeyboardEvent, modifier: Modifier): boolean => {
        switch (modifier) {
            case 'Mod':
                return evt.ctrlKey || evt.metaKey;
            case 'Ctrl':
                return evt.ctrlKey;
            case 'Meta':
                return evt.metaKey;
            case 'Shift':
                return evt.shiftKey;
            case 'Alt':
                return evt.altKey;
            default:
                return false;
        }
    });

    checkModifiers = vi.fn().mockImplementation((evt: KeyboardEvent, modifiers: Modifier[]): boolean => {
        return modifiers.every(modifier => this.isModifier(evt, modifier));
    });

    onTrigger = vi.fn();
    onRelease = vi.fn();
} 