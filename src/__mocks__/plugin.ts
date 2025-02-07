import { vi } from 'vitest';
import type { App, Command, EditorSuggest, HoverLinkSource, MarkdownPostProcessor, ObsidianProtocolHandler, Plugin as IPlugin, PluginManifest, PluginSettingTab, ViewCreator } from 'obsidian';
import { MockComponent } from './components/component';

export class MockPlugin extends MockComponent {
    app: App;
    manifest: PluginManifest;

    constructor(app: App, manifest: PluginManifest) {
        super();
        this.app = app;
        this.manifest = manifest;
    }

    addRibbonIcon = vi.fn((icon: string, title: string, callback: (evt: MouseEvent) => any): HTMLElement => {
        const iconEl = document.createElement('div');
        iconEl.addClass('ribbon-icon');
        iconEl.setAttribute('aria-label', title);
        iconEl.addEventListener('click', callback);
        return iconEl;
    });

    addStatusBarItem = vi.fn((): HTMLElement => {
        const statusBarItem = document.createElement('div');
        statusBarItem.addClass('status-bar-item');
        return statusBarItem;
    });

    addCommand = vi.fn((command: Command): Command => {
        return command;
    });

    removeCommand = vi.fn((commandId: string): void => {
        // Mock de suppression de commande
    });

    addSettingTab = vi.fn((settingTab: PluginSettingTab): void => {
        // Mock d'ajout d'onglet de paramètres
    });

    registerView = vi.fn((type: string, viewCreator: ViewCreator): void => {
        // Mock d'enregistrement de vue
    });

    registerHoverLinkSource = vi.fn((_id: string, _info: HoverLinkSource): void => {
        // Mock d'enregistrement de source de lien au survol
    });

    registerExtensions = vi.fn((_extensions: string[], _viewType: string): void => {
        // Mock d'enregistrement d'extensions
    });

    registerMarkdownPostProcessor = vi.fn((postProcessor: MarkdownPostProcessor, _sortOrder?: number): MarkdownPostProcessor => {
        return postProcessor;
    });

    registerMarkdownCodeBlockProcessor = vi.fn((
        language: string,
        handler: (source: string, el: HTMLElement, ctx: any) => Promise<any> | void,
        sortOrder?: number
    ): MarkdownPostProcessor => {
        return async (el: HTMLElement, ctx: any) => {
            const pre = el.querySelector('pre');
            const code = pre?.querySelector(`code.language-${language}`);
            if (code) {
                await handler(code.textContent || '', el, ctx);
            }
        };
    });

    registerEditorExtension = vi.fn((_extension: any): void => {
        // Mock d'enregistrement d'extension d'éditeur
    });

    registerObsidianProtocolHandler = vi.fn((_action: string, _handler: ObsidianProtocolHandler): void => {
        // Mock d'enregistrement de gestionnaire de protocole
    });

    registerEditorSuggest = vi.fn((_editorSuggest: EditorSuggest<any>): void => {
        // Mock d'enregistrement de suggestions d'éditeur
    });

    loadData = vi.fn(async (): Promise<any> => {
        return {};
    });

    saveData = vi.fn(async (_data: any): Promise<void> => {
        // Mock de sauvegarde de données
    });

    onUserEnable(): void {
        // À surcharger par les sous-classes
    }

    onExternalSettingsChange(): void {
        // À surcharger par les sous-classes
    }
} 