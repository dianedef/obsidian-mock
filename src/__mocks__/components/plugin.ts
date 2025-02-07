import { vi } from 'vitest';
import { App } from '../core/app';
import type { Plugin as IPlugin } from 'obsidian';

export class Plugin implements IPlugin {
    app: App;
    manifest = {
        id: 'mock-plugin',
        name: 'Mock Plugin',
        version: '1.0.0',
        minAppVersion: '0.15.0',
        author: 'Mock Author',
        description: 'A mock plugin for testing'
    };
    settings = {};

    constructor() {
        this.app = new App();
    }

    addCommand = vi.fn();
    addRibbonIcon = vi.fn();
    addSettingTab = vi.fn();
    addStatusBarItem = vi.fn();
    registerView = vi.fn();
    registerExtensions = vi.fn();
    registerMarkdownPostProcessor = vi.fn();
    registerMarkdownCodeBlockProcessor = vi.fn();
    registerCodeMirror = vi.fn();
    registerEditorExtension = vi.fn();
    registerObsidianProtocolHandler = vi.fn();
    registerEvent = vi.fn();
    registerDomEvent = vi.fn();
    registerInterval = vi.fn();
    loadSettings = vi.fn().mockResolvedValue({});
    saveSettings = vi.fn().mockResolvedValue(undefined);
    saveData = vi.fn().mockResolvedValue(undefined);
    loadData = vi.fn().mockResolvedValue({});

    load = vi.fn().mockImplementation(() => {
        this.manifest = {
            id: 'test-plugin',
            name: 'Test Plugin',
            version: '1.0.0',
            minAppVersion: '0.15.0',
            author: 'Test Author',
            description: 'A test plugin'
        };
    });
    onload = vi.fn();
    unload = vi.fn();
    onunload = vi.fn();
}