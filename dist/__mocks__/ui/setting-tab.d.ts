import type { SettingTab as ISettingTab } from 'obsidian';
import { Events } from '../components/events';
export declare class SettingTab extends Events implements ISettingTab {
    app: any;
    containerEl: HTMLElement;
    constructor(app: any, containerEl: HTMLElement);
    display(): void;
    hide(): void;
}
