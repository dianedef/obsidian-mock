import type { Events as IEvents, EventRef, WorkspaceEventCallbacks } from 'obsidian';
export declare class Events implements IEvents {
    private eventRefs;
    private nextEventId;
    on<K extends keyof WorkspaceEventCallbacks>(name: K, callback: WorkspaceEventCallbacks[K], ctx?: any): EventRef;
    off<K extends keyof WorkspaceEventCallbacks>(name: K, callback: WorkspaceEventCallbacks[K]): void;
    offref(ref: EventRef): void;
    trigger<K extends keyof WorkspaceEventCallbacks>(name: K, ...args: Parameters<WorkspaceEventCallbacks[K]>): void;
    tryTrigger<K extends keyof WorkspaceEventCallbacks>(name: K, ...args: Parameters<WorkspaceEventCallbacks[K]>): void;
}
