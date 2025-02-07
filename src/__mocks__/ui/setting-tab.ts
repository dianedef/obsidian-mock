import { vi } from 'vitest';
import type { SettingTab as ISettingTab } from 'obsidian';
import { Events } from '../components/events';

export class SettingTab extends Events implements ISettingTab {
    app: any;
    containerEl: HTMLElement;

    constructor(app: any, containerEl: HTMLElement) {
        super();
        this.app = app;
        this.containerEl = containerEl;
    }

    display(): void {
        this.containerEl.empty();
    }

    hide(): void {
        this.containerEl.empty();
    }
} 