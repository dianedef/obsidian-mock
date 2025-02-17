import { vi } from 'vitest';
import type { App, SettingTab as ISettingTab } from 'obsidian';

export class SettingTab implements ISettingTab {
    app: App;
    containerEl: HTMLElement;
    
    constructor(app: App) {
        this.app = app;
        this.containerEl = document.createElement('div');
        this.containerEl.addClass('settings-tab-container');
    }

    display(): void {
        // Vider le conteneur avant d'afficher les nouveaux paramètres
        this.containerEl.empty();
    }

    hide(): void {
        // Nettoyer le conteneur lors de la fermeture
        this.containerEl.empty();
    }
} 