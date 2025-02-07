import type { KeymapEventHandler, KeymapEventListener, Modifier } from 'obsidian';
export declare class Scope {
    private parent;
    private handlers;
    constructor(parent?: Scope);
    register(modifiers: Modifier[] | null, key: string | null, func: KeymapEventListener): KeymapEventHandler;
    unregister(handler: KeymapEventHandler): void;
    private createHandlerId;
    getParent(): Scope | undefined;
    getHandlers(): Map<string, KeymapEventHandler[]>;
    static mockRegister: import("vitest/dist").Mock<any, any>;
    static mockUnregister: import("vitest/dist").Mock<any, any>;
}
