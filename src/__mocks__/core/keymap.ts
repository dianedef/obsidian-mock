import { Keymap as IKeymap } from 'obsidian';
import { vi } from 'vitest';

export class Keymap implements IKeymap {
    pushScope(scope: string): void {
        // Implementation
    }

    popScope(scope: string): void {
        // Implementation
    }

    static isModifier(evt: MouseEvent | TouchEvent | KeyboardEvent, modifier: string): boolean {
        return false;
    }

    static isModEvent(evt: MouseEvent | TouchEvent | KeyboardEvent): boolean {
        return false;
    }
} 