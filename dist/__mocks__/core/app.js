import { Events } from 'obsidian';
import { Workspace } from '../../core/workspace';
import { Vault } from './vault';
import { MockMetadataCache } from './metadata-cache';
import { FileManager } from './file-manager';
import { Keymap } from './keymap';
import { Scope } from './scope';
import { Commands } from './commands';
export class MockApp extends Events {
    constructor() {
        super();
        this.lastEvent = null;
        this.workspace = new Workspace(this);
        this.vault = new Vault();
        this.metadataCache = new MockMetadataCache();
        this.fileManager = new FileManager();
        this.commands = new Commands();
        this.keymap = new Keymap();
        this.scope = new Scope();
        this.plugins = {};
    }
    loadProgress() {
        return {
            setMessage: () => { },
            finish: () => { }
        };
    }
    initializeLayout() {
        // Implementation
    }
    initializePlugins() {
        // Implementation
    }
    initializeCommands() {
        // Implementation
    }
    initializeKeymap() {
        // Implementation
    }
    initializeFileManager() {
        // Implementation
    }
    initializeMetadataCache() {
        // Implementation
    }
    initializeVault() {
        // Implementation
    }
    initializeWorkspace() {
        // Implementation
    }
    initializeScope() {
        // Implementation
    }
    initializeEvents() {
        // Implementation
    }
    initializeUI() {
        // Implementation
    }
    initializeSettings() {
        // Implementation
    }
    initializePluginSystem() {
        // Implementation
    }
    initializeThemeSystem() {
        // Implementation
    }
    initializeMarkdownPostProcessors() {
        // Implementation
    }
    initializeMarkdownRenderer() {
        // Implementation
    }
    initializeMarkdownPreviewRenderer() {
        // Implementation
    }
    initializeMarkdownSourceMode() {
        // Implementation
    }
    initializeMarkdownView() {
        // Implementation
    }
    initializeMarkdownState() {
        // Implementation
    }
    initializeMarkdownSettings() {
        // Implementation
    }
    initializeMarkdownCommands() {
        // Implementation
    }
    initializeMarkdownKeymap() {
        // Implementation
    }
    initializeMarkdownEvents() {
        // Implementation
    }
    initializeMarkdownUI() {
        // Implementation
    }
    initializeMarkdownPlugins() {
        // Implementation
    }
    initializeMarkdownThemes() {
        // Implementation
    }
}
// Export une instance par défaut pour les tests
export { MockApp as App };
export const app = new MockApp();
