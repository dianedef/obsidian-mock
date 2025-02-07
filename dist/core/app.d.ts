import { App as IApp, Events, FileManager, Vault, Workspace, Keymap, MetadataCache, Scope } from 'obsidian';
import { MockEventRef } from '../components/events';
export declare class App extends Events implements IApp {
    vault: Vault;
    workspace: Workspace;
    fileManager: FileManager;
    keymap: Keymap;
    scope: Scope;
    metadataCache: MetadataCache;
    lastEvent: MouseEvent | KeyboardEvent | null;
    constructor();
    on(name: string, callback: (...data: any[]) => any, ctx?: any): MockEventRef;
}
