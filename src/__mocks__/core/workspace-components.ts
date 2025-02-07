import { vi } from 'vitest';
import { App, Events } from 'obsidian';
import type { 
    WorkspaceItem as IWorkspaceItem,
    WorkspaceParent as IWorkspaceParent,
    WorkspaceContainer as IWorkspaceContainer,
    WorkspaceSplit as IWorkspaceSplit,
    WorkspaceSidedock as IWorkspaceSidedock,
    WorkspaceTabs as IWorkspaceTabs,
    WorkspaceRoot as IWorkspaceRoot,
    WorkspaceWindow as IWorkspaceWindow,
    WorkspaceLeaf as IWorkspaceLeaf,
    WorkspaceMobileDrawer as IWorkspaceMobileDrawer,
    PaneType,
    View,
    ViewState,
    Scope
} from 'obsidian';

// Mock de la classe Scope
class MockScope implements Scope {
    register = vi.fn();
    unregister = vi.fn();
}

// Create a basic View mock
const createBasicView = (app: App): View => {
    const scope = new MockScope();

    const view = {
        getViewType: vi.fn().mockReturnValue('markdown'),
        getState: vi.fn().mockReturnValue({ type: 'markdown' } as ViewState),
        getEphemeralState: vi.fn().mockReturnValue({}),
        setState: vi.fn(),
        setEphemeralState: vi.fn(),
        leaf: null as any,
        app,
        containerEl: document.createElement('div'),
        navigation: true,
        icon: 'document',
        getIcon: vi.fn().mockReturnValue('document'),
        onload: vi.fn(),
        onunload: vi.fn(),
        onOpen: vi.fn(),
        onClose: vi.fn(),
        onResize: vi.fn(),
        onPaneMenu: vi.fn(),
        getDisplayText: vi.fn().mockReturnValue('Mock View'),
        scope,
        load: vi.fn(),
        unload: vi.fn(),
        addChild: vi.fn(),
        removeChild: vi.fn(),
        register: vi.fn(),
        registerEvent: vi.fn(),
        registerDomEvent: vi.fn(),
        registerInterval: vi.fn()
    };

    return view as unknown as View;
};

// Create a basic WorkspaceLeaf mock
const createBasicLeaf = (app: App): IWorkspaceLeaf => {
    const view = createBasicView(app);
    const leaf = {
        view,
        containerEl: document.createElement('div'),
        width: 0,
        height: 0,
        parent: null as any,
        win: window,
        doc: document,
        getViewState: vi.fn().mockReturnValue({}),
        setViewState: vi.fn(),
        setPinned: vi.fn(),
        setGroupMember: vi.fn(),
        setDimension: vi.fn(),
        getContainer: vi.fn(),
        getRoot: vi.fn(),
        tabHeaderEl: document.createElement('div'),
        tabHeaderInnerIconEl: document.createElement('div'),
        tabHeaderInnerTitleEl: document.createElement('div'),
        getDisplayText: vi.fn().mockReturnValue(''),
        pinned: false,
        activeTime: Date.now(),
        working: false,
        children: [],
        addChild: vi.fn(),
        removeChild: vi.fn(),
        replaceChild: vi.fn(),
        on: vi.fn().mockReturnValue({ id: 'event-ref-id' }),
        off: vi.fn(),
        trigger: vi.fn(),
        openFile: vi.fn().mockResolvedValue(undefined),
        open: vi.fn().mockResolvedValue(undefined),
        isDeferred: false,
        loadIfDeferred: vi.fn().mockResolvedValue(undefined),
        getEphemeralState: vi.fn().mockReturnValue({}),
        setEphemeralState: vi.fn(),
        togglePinned: vi.fn(),
        setGroup: vi.fn(),
        detach: vi.fn(),
        setRoot: vi.fn(),
        setParent: vi.fn(),
        getWindow: vi.fn().mockReturnValue(window),
        getIcon: vi.fn().mockReturnValue('document'),
        onResize: vi.fn(),
        offref: vi.fn(),
        tryTrigger: vi.fn()
    };

    view.leaf = leaf;
    return leaf as unknown as IWorkspaceLeaf;
};

export class WorkspaceRoot extends Events implements IWorkspaceRoot, IWorkspaceContainer {
    containerEl: HTMLElement = document.createElement('div');
    win: Window = window;
    doc: Document = document;
    children: IWorkspaceLeaf[] = [];
    activeLeaf: IWorkspaceLeaf | null = null;
    parent: IWorkspaceParent;

    constructor(public app: App) {
        super();
        this.parent = this as unknown as IWorkspaceParent;
    }

    getRoot(): IWorkspaceContainer {
        return this;
    }

    getContainer(): IWorkspaceContainer {
        return this;
    }

    addChild(child: IWorkspaceLeaf, index?: number): void {
        if (typeof index === 'number') {
            this.children.splice(index, 0, child);
        } else {
            this.children.push(child);
        }
        (child as any).parent = this;
    }

    removeChild(child: IWorkspaceLeaf): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    setActiveLeaf(leaf: IWorkspaceLeaf | null): void {
        this.activeLeaf = leaf;
        this.trigger('active-leaf-change', leaf);
    }

    getActiveLeaf(): IWorkspaceLeaf | null {
        return this.activeLeaf;
    }

    createLeaf(): IWorkspaceLeaf {
        const leaf = createBasicLeaf(this.app);
        (leaf as any).parent = this;
        this.children.push(leaf);
        return leaf;
    }
}

export class WorkspaceSidedock extends Events implements IWorkspaceSidedock {
    containerEl: HTMLElement = document.createElement('div');
    win: Window = window;
    doc: Document = document;
    children: IWorkspaceLeaf[] = [];
    collapsed: boolean = false;
    parent: IWorkspaceParent;
    side: 'left' | 'right';

    constructor(parent: IWorkspaceParent, app: App, side: 'left' | 'right') {
        super();
        this.parent = parent;
        this.side = side;
    }

    getRoot(): IWorkspaceContainer {
        return this.parent.getRoot() as unknown as IWorkspaceContainer;
    }

    getContainer(): IWorkspaceContainer {
        return this.parent.getContainer() as unknown as IWorkspaceContainer;
    }

    addChild(child: IWorkspaceLeaf): void {
        this.children.push(child);
        (child as any).parent = this;
    }

    removeChild(child: IWorkspaceLeaf): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    expand(): void {
        this.collapsed = false;
        this.trigger('collapse-change', false);
    }

    collapse(): void {
        this.collapsed = true;
        this.trigger('collapse-change', true);
    }

    toggle(): void {
        this.collapsed = !this.collapsed;
        this.trigger('collapse-change', this.collapsed);
    }
}

export class WorkspaceMobileDrawer extends Events implements IWorkspaceMobileDrawer {
    containerEl: HTMLElement = document.createElement('div');
    win: Window = window;
    doc: Document = document;
    children: IWorkspaceLeaf[] = [];
    collapsed: boolean = false;
    parent: IWorkspaceParent;

    constructor(parent: IWorkspaceParent, app: App) {
        super();
        this.parent = parent;
    }

    getRoot(): IWorkspaceContainer {
        return this.parent.getRoot() as unknown as IWorkspaceContainer;
    }

    getContainer(): IWorkspaceContainer {
        return this.parent.getContainer() as unknown as IWorkspaceContainer;
    }

    addChild(child: IWorkspaceLeaf): void {
        this.children.push(child);
        (child as any).parent = this;
    }

    removeChild(child: IWorkspaceLeaf): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    expand(): void {
        this.collapsed = false;
        this.trigger('collapse-change', false);
    }

    collapse(): void {
        this.collapsed = true;
        this.trigger('collapse-change', true);
    }

    toggle(): void {
        if (this.collapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }
} 