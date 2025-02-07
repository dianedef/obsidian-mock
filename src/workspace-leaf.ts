import { Component } from './components/component';
import { WorkspaceParent, WorkspaceLeaf as IWorkspaceLeaf, View, OpenViewState, TFile } from 'obsidian';
import { WorkspaceContainer } from './core/workspace-components';
import { Events } from './components/events';

export class WorkspaceLeaf extends Events implements IWorkspaceLeaf {
    containerEl: HTMLElement;
    private _parent: WorkspaceParent | null = null;
    private _view: View | null = null;
    group: string = '';
    pinned: boolean = false;
    id: string = Math.random().toString();

    constructor(parent: WorkspaceParent | null = null) {
        super();
        this.containerEl = document.createElement('div');
        this.containerEl.classList.add('workspace-leaf');
        this._parent = parent;
    }

    get view(): View {
        if (!this._view) {
            throw new Error('View is not set');
        }
        return this._view;
    }

    set view(value: View) {
        this._view = value;
    }

    get parent(): WorkspaceParent {
        if (!this._parent) {
            throw new Error('Parent is not set');
        }
        return this._parent;
    }

    set parent(value: WorkspaceParent) {
        this._parent = value;
    }

    setViewState(viewState: any, eState?: any): Promise<void> {
        if (this._view) {
            this._view.setState(viewState, eState);
        }
        return Promise.resolve();
    }

    getViewState(): any {
        return this._view?.getState() ?? null;
    }

    getEphemeralState(): any {
        return this._view?.getEphemeralState() ?? null;
    }

    setEphemeralState(state: any): void {
        this._view?.setEphemeralState(state);
    }

    async open(view: View): Promise<View> {
        this._view = view;
        if (view) {
            this.containerEl.appendChild(view.containerEl);
        }
        return view;
    }

    async openFile(_file: TFile, _openState?: OpenViewState): Promise<void> {
        // TODO: Implement file opening
        return Promise.resolve();
    }

    detach(): void {
        if (this._view) {
            this._view.containerEl.detach();
            this._view = null;
        }
        if (this._parent && this._parent instanceof WorkspaceContainer) {
            this._parent.removeChild(this);
            this._parent = null;
        }
    }

    getRoot(): WorkspaceParent {
        return this._parent?.getRoot() || this;
    }

    getContainer(): WorkspaceContainer {
        const container = this._parent?.getContainer();
        if (!container) {
            throw new Error("WorkspaceLeaf must be attached to a container");
        }
        return container as WorkspaceContainer;
    }

    setPinned(pinned: boolean): void {
        this.pinned = pinned;
        this.trigger('pinned-change', pinned);
    }

    togglePinned(): void {
        this.setPinned(!this.pinned);
    }

    setGroup(group: string): void {
        this.group = group;
        this.trigger('group-change', group);
    }

    setGroupMember(other: IWorkspaceLeaf): void {
        const otherGroup = (other as any).group;
        if (typeof otherGroup === 'string') {
            this.setGroup(otherGroup);
        }
    }

    getIcon(): string {
        return this._view?.getIcon() ?? '';
    }

    getDisplayText(): string {
        return this._view?.getDisplayText() ?? '';
    }

    onResize(): void {
        this._view?.onResize();
    }

    get isDeferred(): boolean {
        return false;
    }

    async loadIfDeferred(): Promise<void> {
        return Promise.resolve();
    }
} 