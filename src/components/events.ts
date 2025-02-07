import type { Events as IEvents, EventRef } from 'obsidian';

export interface MockEventRef extends EventRef {
    id: string;
}

export class Events implements IEvents {
    private eventRefs: Map<string, Set<{ callback: Function; ctx?: any; id: string }>> = new Map();
    private nextEventId = 1;

    on(name: string, callback: (...data: any) => any, ctx?: any): MockEventRef {
        const eventSet = this.eventRefs.get(name) || new Set();
        if (!this.eventRefs.has(name)) {
            this.eventRefs.set(name, eventSet);
        }
        const id = `evt_${this.nextEventId++}`;
        const ref = { callback, ctx, id };
        eventSet.add(ref);
        return { id };
    }

    off(name: string, callback: (...data: any) => any): void {
        const eventSet = this.eventRefs.get(name);
        if (eventSet) {
            for (const ref of eventSet) {
                if (ref.callback === callback) {
                    eventSet.delete(ref);
                    break;
                }
            }
        }
    }

    offref(ref: MockEventRef): void {
        for (const eventSet of this.eventRefs.values()) {
            for (const eventRef of eventSet) {
                if (eventRef.id === ref.id) {
                    eventSet.delete(eventRef);
                    return;
                }
            }
        }
    }

    trigger(name: string, ...data: any[]): void {
        const eventSet = this.eventRefs.get(name);
        if (eventSet) {
            for (const { callback, ctx } of eventSet) {
                callback.apply(ctx, data);
            }
        }
    }

    tryTrigger(name: string, ...data: any[]): void {
        this.trigger(name, ...data);
    }
} 