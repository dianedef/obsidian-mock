import { vi } from 'vitest';
import type { Scope as IScope, KeymapEventHandler, KeymapEventListener, Modifier } from 'obsidian';

export class Scope implements IScope {
    private handlers: KeymapEventHandler[] = [];

    register(modifiers: Modifier[] | null, key: string | null, func: KeymapEventListener): KeymapEventHandler {
        const handler = {
            modifiers: modifiers ? modifiers.join('+') : null,
            key: key || '',
            func,
            scope: this
        } as KeymapEventHandler;
        this.handlers.push(handler);
        return handler;
    }

    unregister(handler: KeymapEventHandler): void {
        const index = this.handlers.indexOf(handler);
        if (index > -1) {
            this.handlers.splice(index, 1);
        }
    }
} 
