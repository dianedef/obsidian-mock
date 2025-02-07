import { WorkspaceContainer } from './core/workspace-components';
import { Events } from './components/events';
export class WorkspaceLeaf extends Events {
    constructor(parent = null) {
        super();
        this._parent = null;
        this._view = null;
        this.group = '';
        this.pinned = false;
        this.id = Math.random().toString();
        this.containerEl = document.createElement('div');
        this.containerEl.classList.add('workspace-leaf');
        this._parent = parent;
    }
    get view() {
        if (!this._view) {
            throw new Error('View is not set');
        }
        return this._view;
    }
    set view(value) {
        this._view = value;
    }
    get parent() {
        if (!this._parent) {
            throw new Error('Parent is not set');
        }
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
    }
    setViewState(viewState, eState) {
        if (this._view) {
            this._view.setState(viewState, eState);
        }
        return Promise.resolve();
    }
    getViewState() {
        return this._view?.getState() ?? null;
    }
    getEphemeralState() {
        return this._view?.getEphemeralState() ?? null;
    }
    setEphemeralState(state) {
        this._view?.setEphemeralState(state);
    }
    async open(view) {
        this._view = view;
        if (view) {
            this.containerEl.appendChild(view.containerEl);
        }
        return view;
    }
    async openFile(_file, _openState) {
        // TODO: Implement file opening
        return Promise.resolve();
    }
    detach() {
        if (this._view) {
            this._view.containerEl.detach();
            this._view = null;
        }
        if (this._parent && this._parent instanceof WorkspaceContainer) {
            this._parent.removeChild(this);
            this._parent = null;
        }
    }
    getRoot() {
        return this._parent?.getRoot() || this;
    }
    getContainer() {
        const container = this._parent?.getContainer();
        if (!container) {
            throw new Error("WorkspaceLeaf must be attached to a container");
        }
        return container;
    }
    setPinned(pinned) {
        this.pinned = pinned;
        this.trigger('pinned-change', pinned);
    }
    togglePinned() {
        this.setPinned(!this.pinned);
    }
    setGroup(group) {
        this.group = group;
        this.trigger('group-change', group);
    }
    setGroupMember(other) {
        const otherGroup = other.group;
        if (typeof otherGroup === 'string') {
            this.setGroup(otherGroup);
        }
    }
    getIcon() {
        return this._view?.getIcon() ?? '';
    }
    getDisplayText() {
        return this._view?.getDisplayText() ?? '';
    }
    onResize() {
        this._view?.onResize();
    }
    get isDeferred() {
        return false;
    }
    async loadIfDeferred() {
        return Promise.resolve();
    }
}
