import { vi } from 'vitest';
import { View } from './view';
// Add Obsidian's DOM methods to HTMLElement
HTMLElement.prototype.addClass = function (className) {
    this.classList.add(className);
};
HTMLElement.prototype.removeClass = function (className) {
    this.classList.remove(className);
};
HTMLElement.prototype.toggleClass = function (className) {
    this.classList.toggle(className);
};
HTMLElement.prototype.detach = function () {
    this.remove();
};
export class ItemView extends View {
    constructor(leaf) {
        super(leaf);
        this.containerEl = document.createElement('div');
        this.contentEl = document.createElement('div');
        this.scope = { register: vi.fn(), unregister: vi.fn() };
        this.icon = 'document';
        this.navigation = true;
        // Protected methods
        this.onOpen = vi.fn().mockResolvedValue(undefined);
        this.onClose = vi.fn().mockResolvedValue(undefined);
        // Public methods
        this.getViewType = vi.fn().mockReturnValue('item-view');
        this.getDisplayText = vi.fn().mockReturnValue('Item View');
        this.getIcon = vi.fn().mockReturnValue(this.icon);
        this.onResize = vi.fn();
        this.getState = vi.fn().mockReturnValue({});
        this.setState = vi.fn().mockResolvedValue(undefined);
        this.getEphemeralState = vi.fn().mockReturnValue({});
        this.setEphemeralState = vi.fn();
        this.onPaneMenu = vi.fn();
        this.onHeaderMenu = vi.fn();
        // Component methods
        this.load = vi.fn();
        this.onload = vi.fn().mockImplementation(() => {
            // Mock de chargement
        });
        this.unload = vi.fn();
        this.onunload = vi.fn().mockImplementation(() => {
            this.contentEl.detach();
        });
        this.registerEvent = vi.fn();
        this.registerDomEvent = vi.fn();
        this.registerInterval = vi.fn().mockReturnValue(0);
        // Additional methods
        this.addAction = vi.fn().mockImplementation((icon, title, callback) => {
            const actionEl = document.createElement('a');
            actionEl.addClass('view-action');
            if (icon)
                actionEl.addClass(icon);
            actionEl.setAttribute('aria-label', title);
            actionEl.addEventListener('click', callback);
            return actionEl;
        });
        this.then = vi.fn().mockImplementation((resolve) => {
            resolve(this);
            return this;
        });
        this.addChild = vi.fn().mockImplementation((child) => {
            return child;
        });
        this.removeChild = vi.fn().mockImplementation((child) => {
            return child;
        });
        this.register = vi.fn().mockImplementation((cb) => {
            cb();
        });
        this.containerEl.appendChild(this.contentEl);
    }
}
