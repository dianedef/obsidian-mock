import { vi } from 'vitest';
import type { PluginSettingTab as IPluginSettingTab, Plugin } from 'obsidian';
import { Events } from '../components/events';

export class PluginSettingTab extends Events implements IPluginSettingTab {
    app: any;
    plugin: Plugin;
    containerEl: HTMLElement;

    constructor(app: any, plugin: Plugin) {
        super();
        this.app = app;
        this.plugin = plugin;
        this.containerEl = document.createElement('div');
        this.containerEl.className = 'plugin-settings-tab';
    }

    display(): void {
        this.containerEl.empty();
    }

    hide(): void {
        this.containerEl.empty();
    }
} 