import { vi } from 'vitest';
import type { Scope, KeymapEventHandler, Modifier } from 'obsidian';

export class MockScope implements Scope {
    keys: string[] = [];
    modifiers: Modifier[] = [];
    handler: KeymapEventHandler | null = null;

    register = vi.fn().mockImplementation((modifiers: Modifier[] | null, key: string | null, func: KeymapEventHandler): KeymapEventHandler => {
        this.modifiers = modifiers || [];
        if (key) this.keys.push(key);
        this.handler = func;
        return func;
    });

    unregister = vi.fn().mockImplementation((handler: KeymapEventHandler): void => {
        if (this.handler === handler) {
            this.handler = null;
        }
    });
} 