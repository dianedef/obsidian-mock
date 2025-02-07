import { Scope as IScope } from 'obsidian';
import { vi } from 'vitest';

export class Scope implements IScope {
    register(modifiers: string[], key: string | null, func: (evt: KeyboardEvent) => boolean): void {
        // Implementation
    }

    unregister(modifiers: string[], key: string | null): void {
        // Implementation
    }
} 