import { View as BaseView } from 'obsidian';
import { vi } from 'vitest';
export class View extends BaseView {
    constructor(leaf) {
        super(leaf);
        this.icon = '';
        this.navigation = false;
        this.onUnloadCallbacks = [];
        this.load = vi.fn();
        this.unload = vi.fn();
        this.addChild = vi.fn().mockImplementation((child) => child);
        this.removeChild = vi.fn().mockImplementation((child) => child);
        this.register = vi.fn().mockImplementation((cb) => cb());
        this.registerEvent = vi.fn();
        this.registerDomEvent = vi.fn();
        this.registerInterval = vi.fn().mockImplementation((id) => id);
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
    onload() {
        // Mock de chargement
    }
    onunload() {
        this.onUnloadCallbacks.forEach(callback => callback());
    }
    addOnUnload(callback) {
        this.onUnloadCallbacks.push(callback);
    }
    getViewType() {
        return 'view';
    }
    getDisplayText() {
        return 'View';
    }
    getIcon() {
        return this.icon;
    }
    setState(_state, _result) {
        return Promise.resolve();
    }
    getState() {
        return {};
    }
    setEphemeralState(_state) { }
    getEphemeralState() {
        return {};
    }
    onOpen() {
        return Promise.resolve();
    }
    onClose() {
        return Promise.resolve();
    }
    onResize() { }
    onPaneMenu(_menu, _source) { }
    onHeaderMenu(_menu) { }
}
