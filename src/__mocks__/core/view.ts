import { vi } from 'vitest';
import type { View as IView, WorkspaceLeaf, ViewStateResult, App, EventRef, Component } from 'obsidian';
import { Events } from '../components/events';
import { createScope, Scope } from './scope';

export class View extends Events implements Partial<IView> {
    leaf: WorkspaceLeaf;
    app: App;
    icon: string = '';
    navigation: boolean = false;
    containerEl: HTMLElement = document.createElement('div');
    titleEl: HTMLElement = document.createElement('div');
    contentEl: HTMLElement = document.createElement('div');
    scope: Scope;
    private registeredEvents: Array<{ unregister: () => void }> = [];
    private children: Component[] = [];
    
    constructor(leaf: WorkspaceLeaf) {
        super();
        this.leaf = leaf;
        this.app = (leaf as any).app;
        this.scope = createScope();
        this.containerEl = document.createElement('div');
        this.containerEl.classList.add('view');
    }

    load = vi.fn().mockImplementation(() => {
        this.onload();
    });

    unload = vi.fn().mockImplementation(() => {
        this.onunload();
        this.registeredEvents.forEach(ref => {
            ref.unregister();
        });
        this.registeredEvents = [];
        this.children.forEach(child => child.unload());
        this.children = [];
    });

    onload = vi.fn();
    onunload = vi.fn();
    onOpen = vi.fn();
    onClose = vi.fn();
    
    getViewType(): string {
        return 'view';
    }

    getDisplayText(): string {
        return 'View';
    }

    getState(): any {
        return {};
    }

    setState = vi.fn().mockImplementation((state: any, result: ViewStateResult): Promise<void> => {
        return Promise.resolve();
    });

    getEphemeralState(): any {
        return {};
    }

    setEphemeralState(state: any): void {}

    getIcon(): string {
        return this.icon;
    }

    onResize(): void {}

    addChild = vi.fn().mockImplementation((child: Component): Component => {
        this.children.push(child);
        return child;
    });

    removeChild = vi.fn().mockImplementation((child: Component): Component => {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            return child;
        }
        return child;
    });

    register = vi.fn().mockImplementation((ref: { unregister: () => void }): void => {
        this.registeredEvents.push(ref);
    });

    registerEvent = vi.fn().mockImplementation((eventRef: EventRef): void => {
        this.register(eventRef);
    });

    onPaneMenu(menu: any, source: string): void {}

    setParent(parent: any): void {}

    deregister(cb: () => any): void {}

    registerDomEvent = vi.fn().mockImplementation((
        el: Window | Document | HTMLElement,
        type: string,
        callback: (ev: any) => any,
        options?: boolean | AddEventListenerOptions
    ): void => {
        const handler = callback.bind(el);
        el.addEventListener(type, handler, options);
        this.register({
            unregister: () => el.removeEventListener(type, handler, options)
        });
    });

    registerInterval = vi.fn().mockImplementation((id: number): number => {
        this.register({
            unregister: () => window.clearInterval(id)
        });
        return id;
    });
} 