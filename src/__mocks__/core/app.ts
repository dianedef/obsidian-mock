import { vi } from 'vitest';
import type { App as IApp, Scope as IScope, Keymap as IKeymap, Workspace as IWorkspace, Vault as IVault, MetadataCache as IMetadataCache, FileManager as IFileManager } from 'obsidian';
import { Workspace } from './workspace';
import { Vault } from './vault';
import { MetadataCache } from './metadata-cache';
import { FileManager } from './file-manager';
import { Keymap } from './keymap';
import { Scope } from './scope';
import { Commands } from './commands';

export class App implements IApp {
    keymap: IKeymap;
    scope: IScope;
    workspace: IWorkspace;
    vault: IVault;
    metadataCache: IMetadataCache;
    fileManager: IFileManager;
    commands: Commands;
    settings: any;
    plugins: any;
    lastEvent: any;

    constructor() {
        this.workspace = new Workspace(this);
        this.vault = new Vault();
        this.metadataCache = new MetadataCache();
        this.fileManager = new FileManager(this);
        this.commands = new Commands();
        this.keymap = new Keymap();
        this.scope = new Scope();
        this.settings = {
            on: vi.fn(),
            off: vi.fn(),
            get: vi.fn(),
            set: vi.fn(),
            clear: vi.fn(),
        };
        this.plugins = {
            manifests: {},
            plugins: {},
            enablePlugin: vi.fn(),
            disablePlugin: vi.fn(),
        };
        this.lastEvent = null;
    }

    loadProgress(): { setMessage: (message: string) => void; finish: () => void; } {
        return {
            setMessage: vi.fn(),
            finish: vi.fn()
        };
    }

    initializeLayout(): void {
        // Implementation
    }

    initializePlugins(): void {
        // Implementation
    }

    initializeCommands(): void {
        // Implementation
    }

    initializeKeymap(): void {
        // Implementation
    }

    initializeFileManager(): void {
        // Implementation
    }

    initializeMetadataCache(): void {
        // Implementation
    }

    initializeVault(): void {
        // Implementation
    }

    initializeWorkspace(): void {
        // Implementation
    }

    initializeScope(): void {
        // Implementation
    }

    initializeEvents(): void {
        // Implementation
    }

    initializeUI(): void {
        // Implementation
    }

    initializeSettings(): void {
        // Implementation
    }

    initializePluginSystem(): void {
        // Implementation
    }

    initializeThemeSystem(): void {
        // Implementation
    }

    initializeMarkdownPostProcessors(): void {
        // Implementation
    }

    initializeMarkdownRenderer(): void {
        // Implementation
    }

    initializeMarkdownPreviewRenderer(): void {
        // Implementation
    }

    initializeMarkdownSourceMode(): void {
        // Implementation
    }

    initializeMarkdownView(): void {
        // Implementation
    }

    initializeMarkdownState(): void {
        // Implementation
    }

    initializeMarkdownSettings(): void {
        // Implementation
    }

    initializeMarkdownCommands(): void {
        // Implementation
    }

    initializeMarkdownKeymap(): void {
        // Implementation
    }

    initializeMarkdownEvents(): void {
        // Implementation
    }

    initializeMarkdownUI(): void {
        // Implementation
    }

    initializeMarkdownPlugins(): void {
        // Implementation
    }

    initializeMarkdownThemes(): void {
        // Implementation
    }
}

// Export une instance par défaut pour les tests
export const app = new App();