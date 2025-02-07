import { App, Events } from 'obsidian';
import { Workspace } from '../../core/workspace';
import { Vault } from './vault';
import { MockMetadataCache } from './metadata-cache';
import { FileManager } from './file-manager';
import { Keymap } from './keymap';
import { Scope } from './scope';
import { Commands } from './commands';

export class MockApp extends Events implements App {
    workspace: Workspace;
    vault: Vault;
    metadataCache: MockMetadataCache;
    fileManager: FileManager;
    commands: Commands;
    keymap: Keymap;
    scope: Scope;
    plugins: Record<string, any>;
    lastEvent: MouseEvent | KeyboardEvent | null = null;

    constructor() {
        super();
        this.workspace = new Workspace(this);
        this.vault = new Vault();
        this.metadataCache = new MockMetadataCache();
        this.fileManager = new FileManager();
        this.commands = new Commands();
        this.keymap = new Keymap();
        this.scope = new Scope();
        this.plugins = {};
    }

    loadProgress(): {
        setMessage: (message: string) => void;
        finish: () => void;
    } {
        return {
            setMessage: () => {},
            finish: () => {}
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
export { MockApp as App };
export const app = new MockApp();