import { vi } from 'vitest';
import type { Events as IEvents } from 'obsidian';

export interface IEventRef {
    unregister: () => void;
}

export class Events implements IEvents {
    protected events: Map<string, Set<Function>>;
    protected loaded: boolean;

    constructor() {
        this.events = new Map();
        this.loaded = true;
    }

    on(name: string, callback: Function, ctx?: any): IEventRef {
        if (!this.events.has(name)) {
            this.events.set(name, new Set());
        }
        const boundCallback = ctx ? callback.bind(ctx) : callback;
        this.events.get(name)?.add(boundCallback);
        
        return {
            unregister: () => {
                this.events.get(name)?.delete(boundCallback);
            }
        };
    }

    off(name: string, callback: Function): void {
        this.events.get(name)?.delete(callback);
    }

    offref(ref: IEventRef): void {
        if (ref && typeof ref.unregister === 'function') {
            ref.unregister();
        }
    }

    trigger(name: string, ...args: any[]): void {
        const callbacks = this.events.get(name);
        if (callbacks) {
            for (const callback of callbacks) {
                try {
                    callback(...args);
                } catch (e) {
                    console.error(`Error triggering event ${name}:`, e);
                }
            }
        }
    }

    tryTrigger(evt: IEventRef, args: any[]): void {
        if (evt && typeof evt.unregister === 'function') {
            try {
                evt.unregister();
            } catch (e) {
                console.error('Error unregistering event:', e);
            }
        }
    }

    load(): void {
        this.loaded = true;
        this.trigger('load');
    }

    unload(): void {
        this.trigger('unload');
        this.loaded = false;
        this.events.clear();
    }
} 