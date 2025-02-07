import { View as BaseView, type WorkspaceLeaf, type Component, type Menu, type ViewStateResult } from 'obsidian';
import { vi } from 'vitest';

export class View extends BaseView {
    icon: string = '';
    navigation = false;
    containerEl: HTMLElement;
    scope: any;

    private onUnloadCallbacks: (() => void)[] = [];

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.containerEl = document.createElement('div');
        this.scope = {
            register: vi.fn(),
            unregister: vi.fn()
        };

        // Mock des méthodes de cycle de vie
        this.onload = vi.fn();
        this.onunload = vi.fn();
        this.onOpen = vi.fn().mockResolvedValue(undefined);
        this.onClose = vi.fn().mockResolvedValue(undefined);
        this.setState = vi.fn().mockResolvedValue(undefined);
        this.getState = vi.fn().mockReturnValue({});
        this.setEphemeralState = vi.fn();
        this.getEphemeralState = vi.fn().mockReturnValue({});
    }

    onload(): void {
        // Mock de chargement
    }

    onunload(): void {
        this.onUnloadCallbacks.forEach(callback => callback());
    }

    addOnUnload(callback: () => void): void {
        this.onUnloadCallbacks.push(callback);
    }

    getViewType(): string {
        return 'view';
    }

    getDisplayText(): string {
        return 'View';
    }

    getIcon(): string {
        return this.icon;
    }

    setState(_state: any, _result: ViewStateResult): Promise<void> {
        return Promise.resolve();
    }

    getState(): any {
        return {};
    }

    setEphemeralState(_state: any): void {}

    getEphemeralState(): any {
        return {};
    }

    protected onOpen(): Promise<void> {
        return Promise.resolve();
    }

    protected onClose(): Promise<void> {
        return Promise.resolve();
    }

    onResize(): void {}

    onPaneMenu(_menu: Menu, _source: string): void {}

    onHeaderMenu(_menu: Menu): void {}

    load = vi.fn();
    unload = vi.fn();

    addChild = vi.fn().mockImplementation((child: Component) => child);
    removeChild = vi.fn().mockImplementation((child: Component) => child);
    register = vi.fn().mockImplementation((cb: () => any) => cb());
    registerEvent = vi.fn();
    registerDomEvent = vi.fn();
    registerInterval = vi.fn().mockImplementation((id: number): number => id);
}