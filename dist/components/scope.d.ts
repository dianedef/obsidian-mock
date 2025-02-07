import type { Scope as IScope, KeymapEventHandler, KeymapEventListener, Modifier } from 'obsidian';
export declare class Scope implements IScope {
    private handlers;
    register(modifiers: Modifier[] | null, key: string | null, func: KeymapEventListener): KeymapEventHandler;
    unregister(handler: KeymapEventHandler): void;
}
