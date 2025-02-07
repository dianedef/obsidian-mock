import { vi } from 'vitest';
import { View as ObsidianView, WorkspaceItem } from 'obsidian';
// Spies pour les méthodes principales
export const viewSpies = {
    onOpen: vi.fn().mockResolvedValue(undefined),
    onClose: vi.fn().mockResolvedValue(undefined),
    onload: vi.fn(),
    onunload: vi.fn(),
    setState: vi.fn().mockResolvedValue(undefined),
    onResize: vi.fn(),
};
export class MockView extends ObsidianView {
    constructor(leaf) {
        super(leaf);
        this.navigation = false;
        this.icon = 'document';
        this.children = [];
        this.events = [];
        this.onload = vi.fn();
        this.onunload = vi.fn();
        this.onResize = vi.fn();
        this.onPaneMenu = vi.fn();
        this.onHeaderMenu = vi.fn();
        this.getViewType = vi.fn().mockReturnValue('default');
        this.getDisplayText = vi.fn().mockReturnValue('View');
        this.getIcon = vi.fn().mockReturnValue(this.icon);
        this.setState = vi.fn().mockImplementation((state, result) => {
            return Promise.resolve();
        });
        this.getState = vi.fn().mockReturnValue({});
        this.getEphemeralState = vi.fn().mockReturnValue({});
        this.setViewData = vi.fn();
        this.clear = vi.fn();
        this.getScroll = vi.fn().mockReturnValue({ top: 0, left: 0 });
        this.applyScroll = vi.fn();
        this.load = vi.fn();
        this.unload = vi.fn();
        this.addChild = vi.fn().mockImplementation((component) => {
            this.children.push(component);
            return component;
        });
        this.removeChild = vi.fn().mockImplementation((component) => {
            const index = this.children.indexOf(component);
            if (index > -1) {
                this.children.splice(index, 1);
            }
            return component;
        });
        this.register = vi.fn().mockImplementation((modifiers, context, listener) => {
            if (this.scope) {
                this.scope.register(modifiers, context, listener);
            }
        });
        this.registerEvent = vi.fn().mockImplementation((eventRef) => {
            this.events.push(eventRef);
        });
        this.registerDomEvent = vi.fn().mockImplementation((el, type, callback, options) => {
            if (el) {
                el.addEventListener(type, callback, options);
            }
        });
        this.registerInterval = vi.fn().mockImplementation((id) => {
            return id;
        });
        this.containerEl = document.createElement('div');
        this.app = leaf.app;
        const mockScope = {
            register: vi.fn().mockReturnValue({
                modifiers: [],
                key: '',
                func: () => { }
            }),
            unregister: vi.fn()
        };
        this.scope = mockScope;
        mockScope.register = vi.fn().mockReturnValue({
            scope: mockScope,
            modifiers: [],
            key: '',
            func: () => { }
        });
    }
}
class EmptyView extends MockView {
    constructor() {
        super(...arguments);
        this.getViewType = vi.fn().mockReturnValue('empty');
        this.getDisplayText = vi.fn().mockReturnValue('Empty');
    }
}
// Spies pour les méthodes de WorkspaceLeaf
export const leafSpies = {
    open: vi.fn(),
    detach: vi.fn(),
    setViewState: vi.fn(),
    openFile: vi.fn(),
    setPinned: vi.fn(),
    setGroup: vi.fn(),
};
export class WorkspaceLeaf extends WorkspaceItem {
    constructor(parent) {
        super();
        this.parent = parent;
        this.containerEl = document.createElement('div');
        this.width = 0;
        this.height = 0;
        this.group = '';
        this.pinned = false;
        this.working = false;
        this.view = new EmptyView(this);
    }
    on(name, callback, ctx) {
        return super.on(name, callback, ctx);
    }
    setPinned(pinned) {
        this.pinned = pinned;
        this.trigger('pinned-change', this);
    }
    setGroup(group) {
        this.group = group || '';
        this.trigger('group-change', this.group);
    }
    getRoot() {
        return this.parent.getRoot();
    }
    getContainer() {
        return this.parent.getContainer();
    }
    async openFile(file, openState) {
        leafSpies.openFile(file, openState);
        this.trigger('file-open', file);
        if (openState) {
            await this.setViewState(openState);
        }
    }
    async open(view) {
        leafSpies.open(view);
        if (this.view && this.view !== view) {
            await this.detach();
        }
        this.view = view;
        view.leaf = this;
        if (view.containerEl) {
            this.containerEl.textContent = '';
            this.containerEl.appendChild(view.containerEl);
        }
        view.load();
        view.onload();
        this.trigger('view-change', view);
        return view;
    }
    getViewState() {
        return {
            type: this.view.getViewType(),
            state: this.view.getState(),
            active: false,
            pinned: this.pinned,
            group: this.group ? this : undefined
        };
    }
    async setViewState(viewState, eState) {
        leafSpies.setViewState(viewState, eState);
        if (viewState.pinned !== undefined) {
            this.setPinned(viewState.pinned);
        }
        if (viewState.group !== undefined) {
            this.setGroup(typeof viewState.group === 'string' ? viewState.group : null);
        }
        await this.view.setState(viewState.state, eState);
    }
    getEphemeralState() {
        return {};
    }
    setEphemeralState(state) { }
    togglePinned() {
        this.setPinned(!this.pinned);
    }
    async detach() {
        leafSpies.detach();
        if (this.view) {
            this.view.unload();
            this.view.onunload();
            if (this.view.containerEl) {
                this.view.containerEl.remove();
            }
        }
        this.view = new EmptyView(this);
        this.trigger('view-change', this.view);
    }
    setGroupMember(other) { }
    get isDeferred() {
        return false;
    }
    async loadIfDeferred() {
        return Promise.resolve();
    }
    getIcon() {
        return this.view.getIcon();
    }
    getDisplayText() {
        return this.view.getDisplayText();
    }
    onResize() {
        this.trigger('resize');
        if (this.view) {
            this.view.onResize();
        }
    }
}
