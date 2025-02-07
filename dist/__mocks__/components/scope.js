import { vi } from 'vitest';
export class Scope {
    constructor(parent) {
        this.handlers = new Map();
        this.parent = parent;
    }
    register(modifiers, key, func) {
        const handlerId = this.createHandlerId(modifiers, key);
        const handler = {
            modifiers: modifiers?.join('+') || null,
            key,
            scope: this
        };
        if (!this.handlers.has(handlerId)) {
            this.handlers.set(handlerId, []);
        }
        this.handlers.get(handlerId)?.push(handler);
        return handler;
    }
    unregister(handler) {
        const handlerId = this.createHandlerId(handler.modifiers ? handler.modifiers.split('+') : null, handler.key);
        const handlers = this.handlers.get(handlerId);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
            if (handlers.length === 0) {
                this.handlers.delete(handlerId);
            }
        }
    }
    createHandlerId(modifiers, key) {
        if (!modifiers && !key)
            return '*';
        const mods = modifiers ? modifiers.sort().join('+') : '';
        return `${mods}:${key || ''}`;
    }
    // Utility methods for tests
    getParent() {
        return this.parent;
    }
    getHandlers() {
        return this.handlers;
    }
}
// Mock test methods
Scope.mockRegister = vi.fn();
Scope.mockUnregister = vi.fn();
