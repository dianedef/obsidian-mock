import { vi } from 'vitest';
export class WorkspaceLeaf {
    constructor(app, parent) {
        // DOM properties
        this.containerEl = document.createElement('div');
        this.tabHeaderEl = document.createElement('div');
        this.tabHeaderInnerTitleEl = document.createElement('div');
        this.tabHeaderInnerIconEl = document.createElement('div');
        this.width = 0;
        this.height = 0;
        this.working = false;
        // State properties
        this._pinned = false;
        this._group = '';
        this._isDeferred = false;
        this.setViewState = vi.fn().mockImplementation(async (state) => {
            if (this.view) {
                return this.view.setState(state.state, { history: false });
            }
            return Promise.resolve();
        });
        // Ephemeral state management methods
        this.getEphemeralState = vi.fn().mockImplementation(() => {
            return this.view?.getEphemeralState() || {};
        });
        this.setEphemeralState = vi.fn().mockImplementation((state) => {
            this.view?.setEphemeralState(state);
        });
        // File management methods
        this.openFile = vi.fn().mockImplementation(async (_file, _openState) => {
            return Promise.resolve();
        });
        this.detach = vi.fn().mockImplementation(() => {
            // Implementation
        });
        // Pin management methods
        this.togglePinned = vi.fn().mockImplementation(() => {
            this._pinned = !this._pinned;
            this.trigger('pinned-change', this._pinned);
        });
        this.setPinned = vi.fn().mockImplementation((pinned) => {
            if (this._pinned !== pinned) {
                this._pinned = pinned;
                this.trigger('pinned-change', pinned);
            }
        });
        // Group management methods
        this.setGroupMember = vi.fn().mockImplementation((other) => {
            const otherLeaf = other;
            if (otherLeaf._group) {
                this.setGroup(otherLeaf._group);
            }
        });
        this.setGroup = vi.fn().mockImplementation((group) => {
            if (this._group !== group) {
                this._group = group;
                this.trigger('group-change', group);
            }
        });
        // Display management methods
        this.getDisplayText = vi.fn().mockReturnValue('');
        this.getIcon = vi.fn().mockReturnValue('document');
        this.onResize = vi.fn();
        // Dimension management methods
        this.setDimensions = vi.fn().mockImplementation((width, height) => {
            this.width = width;
            this.height = height;
            return this;
        });
        // Lifecycle methods
        this.load = vi.fn();
        this.onload = vi.fn();
        this.unload = vi.fn();
        this.onunload = vi.fn();
        this.loadIfDeferred = vi.fn().mockImplementation(async () => {
            if (this._isDeferred) {
                this._isDeferred = false;
            }
            return Promise.resolve();
        });
        // Events methods
        this.on = vi.fn().mockImplementation((_name, _callback, _ctx) => {
            return {};
        });
        this.off = vi.fn();
        this.offref = vi.fn();
        this.trigger = vi.fn();
        this.tryTrigger = vi.fn();
        this.app = app;
        this.parent = parent;
    }
    // View management methods
    getViewState() {
        return {
            type: this.view?.getViewType() || 'default',
            state: this.view?.getState() || {},
            active: false,
            pinned: this._pinned
        };
    }
    async open(view) {
        this.view = view;
        return view;
    }
    // Root and container methods
    getRoot() {
        return this;
    }
    getContainer() {
        return null;
    }
    get isDeferred() {
        return this._isDeferred;
    }
}
