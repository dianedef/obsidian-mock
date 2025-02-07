import { vi } from 'vitest';
import { View as ObsidianView, Modifier, KeymapContext, WorkspaceItem } from 'obsidian';
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
    WorkspaceParent
} from 'obsidian';
import { Events } from '../components/events';
import { WorkspaceItem as WorkspaceItemMock } from './workspace-items';

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
    navigation = false;
    icon = 'document';
    children: Component[] = [];
    events: EventRef[] = [];
    app: App;
    scope: Scope;
    
    constructor(leaf: IWorkspaceLeaf) {
        super(leaf);
        this.containerEl = document.createElement('div');
        this.app = (leaf as any).app;
        const mockScope = {
            register: vi.fn().mockReturnValue({
                modifiers: [],
                key: '',
                func: () => {}
            }),
            unregister: vi.fn()
        };
        this.scope = mockScope;
        mockScope.register = vi.fn().mockReturnValue({
            scope: mockScope,
            modifiers: [],
            key: '',
            func: () => {}
        });
    }

    onload = vi.fn();
    onunload = vi.fn();
    onResize = vi.fn();
    onPaneMenu = vi.fn();
    onHeaderMenu = vi.fn();
    
    getViewType = vi.fn().mockReturnValue('default');
    getDisplayText = vi.fn().mockReturnValue('View');
    getIcon = vi.fn().mockReturnValue(this.icon);
    
    setState = vi.fn().mockImplementation((state: any, result: any) => {
        return Promise.resolve();
    });
    
    getState = vi.fn().mockReturnValue({});
    getEphemeralState = vi.fn().mockReturnValue({});
    
    setViewData = vi.fn();
    clear = vi.fn();
    getScroll = vi.fn().mockReturnValue({ top: 0, left: 0 });
    applyScroll = vi.fn();
    
    load = vi.fn();
    unload = vi.fn();

    addChild = vi.fn().mockImplementation(<T extends Component>(component: T): T => {
        this.children.push(component);
        return component;
    });

    removeChild = vi.fn().mockImplementation(<T extends Component>(component: T): T => {
        const index = this.children.indexOf(component);
        if (index > -1) {
            this.children.splice(index, 1);
        }
        return component;
    });

    register = vi.fn().mockImplementation((modifiers: Modifier[], context: string, listener: KeymapEventListener): void => {
        if (this.scope) {
            this.scope.register(modifiers, context, listener);
        }
    });

    registerEvent = vi.fn().mockImplementation((eventRef: EventRef): void => {
        this.events.push(eventRef);
    });

    registerDomEvent = vi.fn().mockImplementation((
        el: Window | Document | HTMLElement,
        type: string,
        callback: (ev: Event) => any,
        options?: boolean | AddEventListenerOptions
    ): void => {
        if (el) {
            el.addEventListener(type, callback, options);
        }
    });

    registerInterval = vi.fn().mockImplementation((id: number): number => {
        return id;
    });
}

class EmptyView extends MockView {
    getViewType = vi.fn().mockReturnValue('empty');
    getDisplayText = vi.fn().mockReturnValue('Empty');
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

export class WorkspaceLeaf extends WorkspaceItem implements IWorkspaceLeaf {
    view: MockView;
    containerEl: HTMLElement;
    width: number;
    height: number;
    group: string;
    pinned: boolean;
    working: boolean;
    parent!: WorkspaceTabs | WorkspaceMobileDrawer;

    constructor(parent: WorkspaceParent) {
        super();
        this.parent = parent as WorkspaceTabs | WorkspaceMobileDrawer;
        this.containerEl = document.createElement('div');
        this.width = 0;
        this.height = 0;
        this.group = '';
        this.pinned = false;
        this.working = false;
        this.view = new EmptyView(this as unknown as IWorkspaceLeaf);
    }

    on(name: 'pinned-change', callback: (pinned: boolean) => any, ctx?: any): EventRef;
    on(name: 'group-change', callback: (group: string) => any, ctx?: any): EventRef;
    on(name: string, callback: (...data: any[]) => any, ctx?: any): EventRef {
        return super.on(name, callback, ctx);
    }

    setPinned(pinned: boolean): void {
        this.pinned = pinned;
        this.trigger('pinned-change', this);
    }

    setGroup(group: string | null): void {
        this.group = group || '';
        this.trigger('group-change', this.group);
    }

    getRoot(): WorkspaceContainer {
        return this.parent.getRoot() as WorkspaceContainer;
    }
    
    getContainer(): WorkspaceContainer {
        return this.parent.getContainer() as WorkspaceContainer;
    }
    
    async openFile(file: TFile, openState?: ViewState): Promise<void> {
        leafSpies.openFile(file, openState);
        this.trigger('file-open', file);
        if (openState) {
            await this.setViewState(openState);
        }
    }
    
    async open(view: MockView): Promise<MockView> {
        leafSpies.open(view);
        if (this.view && this.view !== view) {
            await this.detach();
        }
        this.view = view;
        view.leaf = this as unknown as IWorkspaceLeaf;
        if (view.containerEl) {
            this.containerEl.textContent = '';
            this.containerEl.appendChild(view.containerEl);
        }
        view.load();
        view.onload();
        this.trigger('view-change', view);
        return view;
    }

    getViewState(): ViewState {
        return {
            type: this.view.getViewType(),
            state: this.view.getState(),
            active: false,
            pinned: this.pinned,
            group: this.group ? this as unknown as IWorkspaceLeaf : undefined
        };
    }

    async setViewState(viewState: ViewState, eState?: any): Promise<void> {
        leafSpies.setViewState(viewState, eState);
        if (viewState.pinned !== undefined) {
            this.setPinned(viewState.pinned);
        }
        if (viewState.group !== undefined) {
            this.setGroup(typeof viewState.group === 'string' ? viewState.group : null);
        }
        await this.view.setState(viewState.state, eState);
    }
    
    getEphemeralState(): any {
        return {};
    }
    
    setEphemeralState(state: any): void {}
    
    togglePinned(): void {
        this.setPinned(!this.pinned);
    }
    
    async detach(): Promise<void> {
        leafSpies.detach();
        if (this.view) {
            this.view.unload();
            this.view.onunload();
            if (this.view.containerEl) {
                this.view.containerEl.remove();
            }
        }
        this.view = new EmptyView(this as unknown as IWorkspaceLeaf);
        this.trigger('view-change', this.view);
    }
    
    setGroupMember(other: IWorkspaceLeaf): void {}
    
    get isDeferred(): boolean {
        return false;
    }
    
    async loadIfDeferred(): Promise<void> {
        return Promise.resolve();
    }

    getIcon(): string {
        return this.view.getIcon();
    }
    
    getDisplayText(): string {
        return this.view.getDisplayText();
    }

    onResize(): void {
        this.trigger('resize');
        if (this.view) {
            this.view.onResize();
        }
    }
} 
