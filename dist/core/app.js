import { Events, FileManager, Vault, Workspace, Keymap, MetadataCache, Scope } from 'obsidian';
export class App extends Events {
    constructor() {
        super();
        this.lastEvent = null;
        this.vault = new Vault();
        this.workspace = new Workspace();
        this.fileManager = new FileManager(this);
        this.keymap = new Keymap();
        this.scope = new Scope();
        this.metadataCache = new MetadataCache();
    }
    on(name, callback, ctx) {
        const eventRef = super.on(name, callback, ctx);
        return { id: Math.random().toString(), ...eventRef };
    }
}
