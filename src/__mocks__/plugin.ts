import { vi } from 'vitest';
import type { App, Command, EditorSuggest, HoverLinkSource, MarkdownPostProcessor, ObsidianProtocolHandler, Plugin as IPlugin, PluginManifest, PluginSettingTab, ViewCreator, EventRef } from 'obsidian';
import { MockComponent } from './components/component';

export class Plugin extends MockComponent {
    app: App;
    manifest: PluginManifest;
    private data: any = {};
    private registeredEvents: EventRef[] = [];
    private defaultData: any = {};

    constructor(app: App, manifest: PluginManifest) {
        super();
        this.app = app;
        this.manifest = manifest;

        // Override onunload to handle event cleanup
        this.onunload = vi.fn().mockImplementation(() => {
            // Clean up registered events
            this.registeredEvents.forEach(eventRef => {
                if ('unregister' in eventRef) {
                    (eventRef as any).unregister();
                }
            });
            this.registeredEvents = [];
        });
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

    unregisterEditorExtension = vi.fn((_extension: any): void => {
        // Mock de désenregistrement d'extension d'éditeur
    });

    registerObsidianProtocolHandler = vi.fn((_action: string, _handler: ObsidianProtocolHandler): void => {
        // Mock d'enregistrement de gestionnaire de protocole
    });

    registerEditorSuggest = vi.fn((_editorSuggest: EditorSuggest<any>): void => {
        // Mock d'enregistrement de suggestions d'éditeur
    });

    loadData = vi.fn().mockImplementation(async (): Promise<any> => {
        try {
            // Simuler un délai de chargement réaliste
            await new Promise(resolve => setTimeout(resolve, 0));
            
            // Fusionner les données par défaut avec les données sauvegardées
            return { ...this.defaultData, ...this.data };
        } catch (error) {
            console.error('Error loading plugin data:', error);
            // En cas d'erreur, retourner les données par défaut
            return { ...this.defaultData };
        }
    });

    saveData = vi.fn().mockImplementation(async (data: any): Promise<void> => {
        try {
            // Simuler un délai de sauvegarde réaliste
            await new Promise(resolve => setTimeout(resolve, 0));
            
            // Sauvegarder uniquement les données qui diffèrent des valeurs par défaut
            const changedData: any = {};
            for (const [key, value] of Object.entries(data)) {
                if (JSON.stringify(value) !== JSON.stringify(this.defaultData[key])) {
                    changedData[key] = value;
                }
            }
            
            this.data = changedData;
            
            // Déclencher l'événement de changement de paramètres
            this.onExternalSettingsChange();
        } catch (error) {
            console.error('Error saving plugin data:', error);
            throw error;
        }
    });

    // Méthode utilitaire pour définir les valeurs par défaut
    setDefaultData(defaults: any): void {
        this.defaultData = { ...defaults };
        // Initialiser les données avec les valeurs par défaut si elles sont vides
        if (Object.keys(this.data).length === 0) {
            this.data = { ...defaults };
        }
    }

    onUserEnable(): void {
        // À surcharger par les sous-classes
    }

    onExternalSettingsChange(): void {
        // À surcharger par les sous-classes
    }

    registerEvent = vi.fn((eventRef: EventRef): void => {
        if (eventRef) {
            this.registeredEvents.push(eventRef);
        }
    });

    // Méthode utilitaire pour tester les événements de presse-papier
    simulateEditorPaste(files: File[]): void {
        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        
        const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: dataTransfer,
            bubbles: true,
            cancelable: true
        });

        this.app.workspace.containerEl.dispatchEvent(pasteEvent);
    }
} 