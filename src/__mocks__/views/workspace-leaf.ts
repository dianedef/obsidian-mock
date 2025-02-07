import { vi } from 'vitest';
import type { 
    WorkspaceLeaf as ObsidianWorkspaceLeaf, 
    ViewState, 
    TFile, 
    OpenViewState,
    IconName,
    EventRef,
    WorkspaceTabs,
    WorkspaceMobileDrawer,
    View
} from 'obsidian';
import { App } from '../obsidian';

export class WorkspaceLeaf implements ObsidianWorkspaceLeaf {
    // DOM properties
    containerEl: HTMLElement = document.createElement('div');
    tabHeaderEl: HTMLElement = document.createElement('div');
    tabHeaderInnerTitleEl: HTMLElement = document.createElement('div');
    tabHeaderInnerIconEl: HTMLElement = document.createElement('div');

    // Base properties
    view!: View;
    app: App;
    parent: WorkspaceTabs | WorkspaceMobileDrawer;
    width: number = 0;
    height: number = 0;
    working: boolean = false;

    // State properties
    private _pinned: boolean = false;
    private _group: string = '';
    private _isDeferred: boolean = false;

    constructor(app: App, parent: WorkspaceTabs | WorkspaceMobileDrawer) {
        this.app = app;
        this.parent = parent;
    }

    // View management methods
    getViewState(): ViewState {
        return {
            type: this.view?.getViewType() || 'default',
            state: this.view?.getState() || {},
            active: false,
            pinned: this._pinned
        };
    }

    setViewState = vi.fn().mockImplementation(async (state: ViewState): Promise<void> => {
        if (this.view) {
            return this.view.setState(state.state, { history: false });
        }
        return Promise.resolve();
    });

    async open(view: View): Promise<View> {
        this.view = view;
        return view;
    }

    // Root and container methods
    getRoot(): WorkspaceLeaf {
        return this;
    }

    getContainer(): any {
        return null;
    }

    // Ephemeral state management methods
    getEphemeralState = vi.fn().mockImplementation(() => {
        return this.view?.getEphemeralState() || {};
    });

    setEphemeralState = vi.fn().mockImplementation((state: any) => {
        this.view?.setEphemeralState(state);
    });

    // File management methods
    openFile = vi.fn().mockImplementation(async (_file: TFile, _openState?: OpenViewState): Promise<void> => {
        return Promise.resolve();
    });

    detach = vi.fn().mockImplementation((): void => {
        // Implementation
    });

    // Pin management methods
    togglePinned = vi.fn().mockImplementation((): void => {
        this._pinned = !this._pinned;
        this.trigger('pinned-change', this._pinned);
    });

    setPinned = vi.fn().mockImplementation((pinned: boolean): void => {
        if (this._pinned !== pinned) {
            this._pinned = pinned;
            this.trigger('pinned-change', pinned);
        }
    });

    // Group management methods
    setGroupMember = vi.fn().mockImplementation((other: WorkspaceLeaf): void => {
        const otherLeaf = other as WorkspaceLeaf;
        if (otherLeaf._group) {
            this.setGroup(otherLeaf._group);
        }
    });

    setGroup = vi.fn().mockImplementation((group: string): void => {
        if (this._group !== group) {
            this._group = group;
            this.trigger('group-change', group);
        }
    });

    // Display management methods
    getDisplayText = vi.fn().mockReturnValue('');
    getIcon = vi.fn().mockReturnValue('document' as IconName);
    onResize = vi.fn();

    // Dimension management methods
    setDimensions = vi.fn().mockImplementation((width: number, height: number): WorkspaceLeaf => {
        this.width = width;
        this.height = height;
        return this;
    });

    // Lifecycle methods
    load = vi.fn();
    onload = vi.fn();
    unload = vi.fn();
    onunload = vi.fn();

    get isDeferred(): boolean {
        return this._isDeferred;
    }

    loadIfDeferred = vi.fn().mockImplementation(async (): Promise<void> => {
        if (this._isDeferred) {
            this._isDeferred = false;
        }
        return Promise.resolve();
    });

    // Events methods
    on = vi.fn().mockImplementation((_name: string, _callback: any, _ctx?: any): EventRef => {
        return {} as EventRef;
    });

    off = vi.fn();
    offref = vi.fn();
    trigger = vi.fn();
    tryTrigger = vi.fn();
}
