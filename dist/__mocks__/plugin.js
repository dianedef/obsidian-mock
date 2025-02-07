import { vi } from 'vitest';
import { MockComponent } from './components/component';
export class MockPlugin extends MockComponent {
    constructor(app, manifest) {
        super();
        this.addRibbonIcon = vi.fn((icon, title, callback) => {
            const iconEl = document.createElement('div');
            iconEl.addClass('ribbon-icon');
            iconEl.setAttribute('aria-label', title);
            iconEl.addEventListener('click', callback);
            return iconEl;
        });
        this.addStatusBarItem = vi.fn(() => {
            const statusBarItem = document.createElement('div');
            statusBarItem.addClass('status-bar-item');
            return statusBarItem;
        });
        this.addCommand = vi.fn((command) => {
            return command;
        });
        this.removeCommand = vi.fn((commandId) => {
            // Mock de suppression de commande
        });
        this.addSettingTab = vi.fn((settingTab) => {
            // Mock d'ajout d'onglet de paramètres
        });
        this.registerView = vi.fn((type, viewCreator) => {
            // Mock d'enregistrement de vue
        });
        this.registerHoverLinkSource = vi.fn((_id, _info) => {
            // Mock d'enregistrement de source de lien au survol
        });
        this.registerExtensions = vi.fn((_extensions, _viewType) => {
            // Mock d'enregistrement d'extensions
        });
        this.registerMarkdownPostProcessor = vi.fn((postProcessor, _sortOrder) => {
            return postProcessor;
        });
        this.registerMarkdownCodeBlockProcessor = vi.fn((language, handler, sortOrder) => {
            return async (el, ctx) => {
                const pre = el.querySelector('pre');
                const code = pre?.querySelector(`code.language-${language}`);
                if (code) {
                    await handler(code.textContent || '', el, ctx);
                }
            };
        });
        this.registerEditorExtension = vi.fn((_extension) => {
            // Mock d'enregistrement d'extension d'éditeur
        });
        this.registerObsidianProtocolHandler = vi.fn((_action, _handler) => {
            // Mock d'enregistrement de gestionnaire de protocole
        });
        this.registerEditorSuggest = vi.fn((_editorSuggest) => {
            // Mock d'enregistrement de suggestions d'éditeur
        });
        this.loadData = vi.fn(async () => {
            return {};
        });
        this.saveData = vi.fn(async (_data) => {
            // Mock de sauvegarde de données
        });
        this.app = app;
        this.manifest = manifest;
    }
    onUserEnable() {
        // À surcharger par les sous-classes
    }
    onExternalSettingsChange() {
        // À surcharger par les sous-classes
    }
}
