import { App as IApp, Events, FileManager, Vault, Workspace, Keymap, MetadataCache, Scope } from 'obsidian';
import { MockEventRef } from '../components/events';

export class App extends Events implements IApp {
    vault: Vault;
    workspace: Workspace;
    fileManager: FileManager;
    keymap: Keymap;
    scope: Scope;
    metadataCache: MetadataCache;
    lastEvent: MouseEvent | KeyboardEvent | null = null;

    constructor() {
        super();
        this.vault = new Vault();
        this.workspace = new Workspace();
        this.fileManager = new FileManager(this);
        this.keymap = new Keymap();
        this.scope = new Scope();
        this.metadataCache = new MetadataCache();
    }

    on(name: string, callback: (...data: any[]) => any, ctx?: any): MockEventRef {
        const eventRef = super.on(name, callback, ctx);
        return { id: Math.random().toString(), ...eventRef };
    }
} 