import type { WorkspaceLeaf, Component } from 'obsidian';

// Exporter nos implémentations mock
export { App } from './core/app';
export { Workspace } from './core/workspace';
export { Events } from './components/events';
export { FileManager } from './core/file-manager';
export { Notice } from './components/notice';
export { PluginSettingTab } from './components/plugin-setting-tab';
export { Plugin } from './plugin';
export { 
    WorkspaceRoot,
    WorkspaceSplit,
    WorkspaceSidedock,
    WorkspaceMobileDrawer 
} from './core/workspace-components';

// Exporter les fonctions utilitaires
export { setIcon, setTooltip } from './utils/dom';

// Base View class
export abstract class View {
    leaf: WorkspaceLeaf;
    containerEl: HTMLElement;
    scope: any;
    protected events: Map<string, Set<Function>> = new Map();

    constructor(leaf: WorkspaceLeaf) {
        this.leaf = leaf;
        this.containerEl = document.createElement('div');
        this.containerEl.classList.add('view-content');
    }

    on(event: string, callback: Function): void {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event)?.add(callback);
    }

    off(event: string, callback: Function): void {
        this.events.get(event)?.delete(callback);
    }

    trigger(event: string, ...args: any[]): void {
        this.events.get(event)?.forEach(callback => {
            callback(...args);
        });
    }

    onload(): void {
        this.trigger('load');
    }

    onunload(): void {
        this.trigger('unload');
    }

    getViewType(): string {
        return 'default';
    }

    getDisplayText(): string {
        return 'View';
    }

    getIcon(): string {
        return 'document';
    }

    getState(): any {
        return {};
    }

    setState(state: any, result: any): Promise<void> {
        return Promise.resolve();
    }

    getEphemeralState(): any {
        return {};
    }

    setEphemeralState(state: any): void {}

    getScroll(): number {
        return this.containerEl.scrollTop;
    }

    setScroll(scroll: number): void {
        this.containerEl.scrollTop = scroll;
    }

    onOpen(): Promise<void> {
        return Promise.resolve();
    }

    onClose(): Promise<void> {
        return Promise.resolve();
    }

    onResize(): void {}

    addChild<T extends Component>(component: T): T {
        if ('containerEl' in component) {
            this.containerEl.appendChild((component as any).containerEl);
        }
        return component;
    }

    removeChild<T extends Component>(component: T): T {
        if ('containerEl' in component && this.containerEl.contains((component as any).containerEl)) {
            this.containerEl.removeChild((component as any).containerEl);
        }
        return component;
    }
}