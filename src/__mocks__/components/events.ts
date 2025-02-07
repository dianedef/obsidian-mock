import type { Events as IEvents, TFile, WorkspaceLeaf, EventRef, WorkspaceEventCallbacks } from 'obsidian';

export class Events implements IEvents {
    private eventRefs: Map<string, Set<{ callback: Function; ctx?: any; id: string }>> = new Map();
    private nextEventId = 1;

    on<K extends keyof WorkspaceEventCallbacks>(
        name: K,
        callback: WorkspaceEventCallbacks[K],
        ctx?: any
    ): EventRef {
        if (!this.eventRefs.has(name)) {
            this.eventRefs.set(name, new Set());
        }
        const eventSet = this.eventRefs.get(name)!;
        const id = `evt_${this.nextEventId++}`;
        const ref = { callback, ctx, id };
        eventSet.add(ref);
        return { id };
    }

    off<K extends keyof WorkspaceEventCallbacks>(
        name: K,
        callback: WorkspaceEventCallbacks[K]
    ): void {
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

    offref(ref: EventRef): void {
        for (const eventSet of this.eventRefs.values()) {
            for (const eventRef of eventSet) {
                if (eventRef.id === ref.id) {
                    eventSet.delete(eventRef);
                    return;
                }
            }
        }
    }

    trigger<K extends keyof WorkspaceEventCallbacks>(
        name: K,
        ...args: Parameters<WorkspaceEventCallbacks[K]>
    ): void {
        const eventSet = this.eventRefs.get(name);
        if (eventSet) {
            for (const { callback, ctx } of eventSet) {
                callback.apply(ctx, args);
            }
        }
    }

    tryTrigger<K extends keyof WorkspaceEventCallbacks>(
        name: K,
        ...args: Parameters<WorkspaceEventCallbacks[K]>
    ): void {
        this.trigger(name, ...args);
    }
} 