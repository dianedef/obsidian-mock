import { vi } from 'vitest';
import { App } from '../core/app';
export class Plugin {
    constructor() {
        this.manifest = {
            id: 'mock-plugin',
            name: 'Mock Plugin',
            version: '1.0.0',
            minAppVersion: '0.15.0',
            author: 'Mock Author',
            description: 'A mock plugin for testing'
        };
        this.settings = {};
        this.addCommand = vi.fn();
        this.addRibbonIcon = vi.fn();
        this.addSettingTab = vi.fn();
        this.addStatusBarItem = vi.fn();
        this.registerView = vi.fn();
        this.registerExtensions = vi.fn();
        this.registerMarkdownPostProcessor = vi.fn();
        this.registerMarkdownCodeBlockProcessor = vi.fn();
        this.registerCodeMirror = vi.fn();
        this.registerEditorExtension = vi.fn();
        this.registerObsidianProtocolHandler = vi.fn();
        this.registerEvent = vi.fn();
        this.registerDomEvent = vi.fn();
        this.registerInterval = vi.fn();
        this.loadSettings = vi.fn().mockResolvedValue({});
        this.saveSettings = vi.fn().mockResolvedValue(undefined);
        this.saveData = vi.fn().mockResolvedValue(undefined);
        this.loadData = vi.fn().mockResolvedValue({});
        this.load = vi.fn().mockImplementation(() => {
            this.manifest = {
                id: 'test-plugin',
                name: 'Test Plugin',
                version: '1.0.0',
                minAppVersion: '0.15.0',
                author: 'Test Author',
                description: 'A test plugin'
            };
        });
        this.onload = vi.fn();
        this.unload = vi.fn();
        this.onunload = vi.fn();
        this.app = new App();
    }
}
