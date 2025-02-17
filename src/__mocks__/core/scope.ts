import { vi } from 'vitest';
import type { Scope as IScope, KeymapEventHandler, Modifier, KeymapEventListener } from 'obsidian';

export class Scope implements IScope {
    private parent: Scope | null;
    private keys: Set<string> = new Set();

    constructor(parent: Scope | null = null) {
        this.parent = parent;
    }

    register = vi.fn().mockImplementation((modifiers: Modifier[] | null, key: string | null, func: KeymapEventListener): KeymapEventHandler => {
        return (func as unknown) as KeymapEventHandler;
    });

    unregister = vi.fn();
}

export const createScope = (): Scope => new Scope();

export { Scope as default }; 