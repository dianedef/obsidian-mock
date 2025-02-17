import { vi } from 'vitest';
import type {
    WorkspaceLeaf as IWorkspaceLeaf,
    ViewState,
    TFile,
    Menu,
    App,
    Scope,
    Component,
    EventRef,
    WorkspaceContainer,
    KeymapEventListener,
    WorkspaceTabs,
    WorkspaceMobileDrawer,
    WorkspaceParent,
    OpenViewState,
    IconName,
    View
} from 'obsidian';
import { Events } from '../components/events';
import { DefaultView } from '../views/default-view';

// Spies pour les méthodes de WorkspaceLeaf
export const leafSpies = {
    open: vi.fn(),
    detach: vi.fn(),
    setViewState: vi.fn(),
    openFile: vi.fn(),
    setPinned: vi.fn(),
    setGroup: vi.fn(),
};

export class WorkspaceLeaf extends Events implements IWorkspaceLeaf {
    containerEl: HTMLElement = document.createElement('div');
    tabHeaderEl: HTMLElement = document.createElement('div');
    tabHeaderInnerTitleEl: HTMLElement = document.createElement('div');
    tabHeaderInnerIconEl: HTMLElement = document.createElement('div');

    view: View;
    app: App;
    parent: WorkspaceTabs | WorkspaceMobileDrawer;
    width: number = 0;
    height: number = 0;
    working: boolean = false;

    private _pinned: boolean = false;
    private _group: string = '';
    private _isDeferred: boolean = false;

    constructor(app: App, parent: WorkspaceTabs | WorkspaceMobileDrawer) {
        super();
        this.app = app;
        this.parent = parent;
        this.containerEl.classList.add('workspace-leaf');
        this.containerEl.setAttribute('data-type', 'leaf');
        this.view = new DefaultView(this);
    }

    setPinned(pinned: boolean): void {
        this._pinned = pinned;
        this.trigger('pinned-change', pinned);
    }

    isPinned(): boolean {
        return this._pinned;
    }

    setGroup(group: string): void {
        this._group = group;
        this.trigger('group-change', group);
    }

    getGroup(): string {
        return this._group;
    }

    setDeferred(deferred: boolean): void {
        this._isDeferred = deferred;
    }

    get isDeferred(): boolean {
        return this._isDeferred;
    }

    getRoot(): WorkspaceParent {
        return this.parent;
    }

    async openFile(file: TFile, openState?: OpenViewState): Promise<void> {
        return Promise.resolve();
    }

    async open(view: View): Promise<View> {
        if (this.view) {
            await this.view.onunload();
        }
        this.view = view;
        await view.onload();
        this.trigger('view-change', view);
        return view;
    }

    getViewState(): ViewState {
        return {
            type: this.view?.getViewType() || '',
            state: this.view?.getState() || {},
            active: false,
            pinned: this._pinned,
            group: this._group
        };
    }

    async setViewState(viewState: ViewState, eState?: any): Promise<void> {
        if (this.view) {
            await this.view.setState(viewState.state, { history: false });
            if (eState) {
                this.view.setEphemeralState(eState);
            }
        }
    }

    getEphemeralState(): any {
        return this.view?.getEphemeralState() || {};
    }

    setEphemeralState(state: any): void {
        this.view?.setEphemeralState(state);
    }

    togglePinned(): void {
        this.setPinned(!this._pinned);
    }

    detach(): void {
        if (this.parent && 'removeLeaf' in this.parent) {
            this.parent.removeLeaf(this);
            (this.app.workspace as any).detachLeaf(this);
        }
    }

    getDisplayText(): string {
        return this.view?.getDisplayText() || '';
    }

    getIcon(): IconName {
        return this.view?.getIcon() as IconName || 'document';
    }

    onResize(): void {
        this.view?.onResize();
        this.trigger('resize');
    }

    onPaneMenu(menu: Menu, source: string): void {
        // Implementation
    }

    onload(): void {
        this.trigger('load');
    }

    onunload(): void {
        this.trigger('unload');
    }

    async loadIfDeferred(): Promise<void> {
        if (this._isDeferred && this.view) {
            this._isDeferred = false;
            await this.open(this.view);
        }
    }

    getContainer(): WorkspaceContainer {
        return this.parent.getContainer() as WorkspaceContainer;
    }

    setGroupMember(other: IWorkspaceLeaf): void {
        const group = other.getGroup?.();
        if (group) {
            this.setGroup(group);
        }
    }

    offref(ref: EventRef): void {
        // Implementation
    }
} 
