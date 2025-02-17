import { vi } from 'vitest';
import type { App, Plugin } from 'obsidian';

export class PluginSettingTab {
    containerEl: HTMLElement;

    constructor(public app: App, public plugin: Plugin) {
        this.containerEl = document.createElement('div');
    }

    display = vi.fn();
    hide = vi.fn();
} 