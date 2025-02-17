import { vi } from 'vitest';
import type { App, WorkspaceLeaf, Scope, Component, Menu } from 'obsidian';
import { View } from '../core/view';
import { ItemView as IItemView } from 'obsidian';

// Extend HTMLElement prototype with Obsidian's DOM methods
declare global {
    interface HTMLElement {
        addClass(className: string): void;
        removeClass(className: string): void;
        toggleClass(className: string): void;
        detach(): void;
    }
}

// Add Obsidian's DOM methods to HTMLElement
HTMLElement.prototype.addClass = function(className: string) {
    this.classList.add(className);
};

HTMLElement.prototype.removeClass = function(className: string) {
    this.classList.remove(className);
};

HTMLElement.prototype.toggleClass = function(className: string) {
    this.classList.toggle(className);
};

HTMLElement.prototype.detach = function() {
    this.remove();
};

export class ItemView extends View implements IItemView {
    containerEl: HTMLElement = document.createElement('div');
    contentEl: HTMLElement = document.createElement('div');
    scope: Scope = { register: vi.fn(), unregister: vi.fn() };
    icon: string = 'document';
    navigation = true;
    
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.containerEl.appendChild(this.contentEl);
    }

    // Protected methods
    onOpen = vi.fn().mockResolvedValue(undefined);
    onClose = vi.fn().mockResolvedValue(undefined);

    // Public methods
    getViewType = vi.fn().mockReturnValue('item-view');
    getDisplayText = vi.fn().mockReturnValue('Item View');
    getIcon = vi.fn().mockReturnValue(this.icon);
    onResize = vi.fn();
    
    getState = vi.fn().mockReturnValue({});
    setState = vi.fn().mockResolvedValue(undefined);
    getEphemeralState = vi.fn().mockReturnValue({});
    setEphemeralState = vi.fn();
    onPaneMenu = vi.fn();
    onHeaderMenu = vi.fn();

    // Component methods
    load = vi.fn();
    onload = vi.fn().mockImplementation((): void => {
    });
    unload = vi.fn();
    onunload = vi.fn().mockImplementation((): void => {
        this.contentEl.detach();
    });
    registerEvent = vi.fn();
    registerDomEvent = vi.fn();
    registerInterval = vi.fn().mockReturnValue(0);

    // Additional methods
    addAction = vi.fn().mockImplementation((icon: string, title: string, callback: (evt: MouseEvent) => any): HTMLElement => {
        const actionEl = document.createElement('a');
        actionEl.addClass('view-action');
        if (icon) actionEl.addClass(icon);
        actionEl.setAttribute('aria-label', title);
        actionEl.addEventListener('click', callback);
        return actionEl;
    });

    then = vi.fn().mockImplementation((resolve) => {
        resolve(this);
        return this;
    });

    addChild = vi.fn().mockImplementation((child: Component) => {
        return child;
    });

    removeChild = vi.fn().mockImplementation((child: Component) => {
        return child;
    });

    register = vi.fn().mockImplementation((cb: () => any) => {
        cb();
    });
}
