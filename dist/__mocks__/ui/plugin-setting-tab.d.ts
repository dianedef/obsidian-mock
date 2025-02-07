import type { PluginSettingTab as IPluginSettingTab, Plugin } from 'obsidian';
import { Events } from '../components/events';
export declare class PluginSettingTab extends Events implements IPluginSettingTab {
    app: any;
    plugin: Plugin;
    containerEl: HTMLElement;
    constructor(app: any, plugin: Plugin);
    display(): void;
    hide(): void;
}
