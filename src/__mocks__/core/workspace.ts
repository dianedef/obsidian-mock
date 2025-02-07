import { vi } from 'vitest';
import type { 
    App,
    Component,
    WorkspaceLeaf,
    WorkspaceParent,
    WorkspaceItem,
    PaneType,
    View,
    ViewState,
    EventRef,
    SplitDirection,
    OpenViewState,
    WorkspaceWindowInitData
} from 'obsidian';
import { 
    WorkspaceWindow,
    WorkspaceRoot,
    WorkspaceSplit,
    WorkspaceTabs,
    WorkspaceSidedock,
    WorkspaceMobileDrawer,
    WorkspaceContainer
} from './workspace-components';
import { debounce } from '../utils/debounce';
import { Events as EventsImpl } from '../components/events';

// Mock de la classe Scope
class Scope {
    register = vi.fn();
    unregister = vi.fn();
}

// Create a basic View mock
const createBasicView = (app: App) => {
    const view = {
        app,
        containerEl: document.createElement('div'),
        onload: () => Promise.resolve(),
        onunload: () => Promise.resolve(),
        getViewType: () => 'markdown',
        getState: () => ({}),
        setState: vi.fn(),
        getEphemeralState: () => ({}),
        setEphemeralState: vi.fn(),
        leaf: undefined,
        navigation: true,
        file: undefined,
        allowNoFile: true,
        icon: 'document',
        title: '',
        titleEl: document.createElement('div'),
        contentEl: document.createElement('div'),
        onResize: vi.fn(),
        getDisplayText: () => '',
        onPaneMenu: vi.fn(),
        on: vi.fn().mockReturnValue({ id: 'event-ref-id' }),
        off: vi.fn(),
        trigger: vi.fn()
    };
    (view as any).view = {
        getViewType: () => 'markdown'
    };
    return view;
};

// Create a basic WorkspaceLeaf mock
const createBasicLeaf = (app: App): WorkspaceLeaf => {
    const view = createBasicView(app);
    const leaf = {
        app,
        view,
        containerEl: document.createElement('div'),
        width: 0,
        height: 0,
        parent: null,
        win: window,
        doc: document,
        getViewState: () => ({ type: 'markdown', state: {} }),
        setViewState: () => Promise.resolve(),
        setPinned: vi.fn(),
        setGroupMember: vi.fn(),
        setDimension: vi.fn(),
        getContainer: vi.fn(),
        getRoot: vi.fn(),
        tabHeaderEl: document.createElement('div'),
        tabHeaderInnerIconEl: document.createElement('div'),
        tabHeaderInnerTitleEl: document.createElement('div'),
        getDisplayText: () => '',
        pinned: false,
        activeTime: Date.now(),
        working: false,
        children: [],
        type: 'leaf',
        addChild: vi.fn(),
        removeChild: vi.fn(),
        replaceChild: vi.fn(),
        on: vi.fn().mockReturnValue({ id: 'event-ref-id' }),
        off: vi.fn(),
        trigger: vi.fn(),
        openFile: () => Promise.resolve(),
        open: () => Promise.resolve(),
        isDeferred: false,
        loadIfDeferred: () => Promise.resolve(),
        getEphemeralState: () => ({}),
        setEphemeralState: vi.fn(),
        togglePinned: vi.fn(),
        setGroup: vi.fn(),
        detach: vi.fn(),
        setRoot: vi.fn(),
        setParent: vi.fn().mockImplementation((parent: any) => {
            leaf.parent = parent;
        }),
        getWindow: () => window,
        getIcon: () => 'document',
        onResize: vi.fn(),
        offref: vi.fn(),
        tryTrigger: vi.fn()
    };
    (leaf as any).view.leaf = leaf;
    return leaf as unknown as WorkspaceLeaf;
};

interface Constructor<T> {
    new (...args: any[]): T;
}

export class MockWorkspace extends EventsImpl {
    rootSplit: WorkspaceSplit;
    leftSplit: WorkspaceSplit | null = null;
    rightSplit: WorkspaceSplit | null = null;
    floatingSplit: WorkspaceSplit | null = null;
    activeLeaf: WorkspaceLeaf | null = null;
    leftRibbon: HTMLElement;
    rightRibbon: HTMLElement;
    containerEl: HTMLElement;
    layoutReady: boolean = false;
    readonly app: App;

    constructor(app: App) {
        super();
        this.app = app;
        this.rootSplit = new WorkspaceSplit(null, app);
        this.leftSplit = new WorkspaceSplit(this.rootSplit, app);
        this.rightSplit = new WorkspaceSplit(this.rootSplit, app);
        this.floatingSplit = new WorkspaceSplit(null, app);
        this.leftRibbon = document.createElement('div');
        this.rightRibbon = document.createElement('div');
        this.containerEl = document.createElement('div');
    }

    getLeaf(): WorkspaceLeaf {
        return this.rootSplit.getLeaf();
    }

    getLeftLeaf(): WorkspaceLeaf {
        return this.leftSplit?.getLeaf() || this.getLeaf();
    }

    getRightLeaf(): WorkspaceLeaf {
        return this.rightSplit?.getLeaf() || this.getLeaf();
    }

    createLeafInParent(parent: WorkspaceParent): WorkspaceLeaf {
        if (parent instanceof WorkspaceSplit) {
            return parent.getLeaf();
        }
        return this.getLeaf();
    }

    setActiveLeaf(leaf: WorkspaceLeaf | null): void {
        this.activeLeaf = leaf;
    }

    splitLeaf(_leaf: WorkspaceLeaf, newLeaf: WorkspaceLeaf): WorkspaceLeaf {
        return newLeaf;
    }

    async duplicateLeaf(leaf: WorkspaceLeaf): Promise<WorkspaceLeaf> {
        return this.createLeafInParent(leaf.parent);
    }

    iterateLeaves(callback: (leaf: WorkspaceLeaf) => any, item?: WorkspaceItem): void {
        const stack: WorkspaceItem[] = [item || this.rootSplit];
        while (stack.length > 0) {
            const current = stack.pop();
            if (!current) continue;
            if ('view' in current && current.view) {
                callback(current as WorkspaceLeaf);
            }
        }
    }

    getLeavesOfType(type: string): WorkspaceLeaf[] {
        const leaves: WorkspaceLeaf[] = [];
        this.iterateLeaves((leaf) => {
            if (leaf.view && leaf.view.getViewType() === type) {
                leaves.push(leaf);
            }
        });
        return leaves;
    }

    detachLeavesOfType(type: string): void {
        this.getLeavesOfType(type).forEach(() => {
            // Ne rien faire pour le moment
        });
    }

    moveLeafToPopout(): void {
        // Implémentation simplifiée
    }

    getAncestorOfType(el: HTMLElement): WorkspaceLeaf | null {
        let current = el;
        while (current && current !== document.body) {
            const leaf = (current as any)._leaf;
            if (leaf && 'view' in leaf && leaf.view) {
                return leaf as WorkspaceLeaf;
            }
            current = current.parentElement as HTMLElement;
        }
        return null;
    }

    async saveLayout(): Promise<void> {
        // Implementation
    }

    async loadLayout(): Promise<void> {
        // Implementation
    }

    createLeaf(): WorkspaceLeaf {
        return this.getLeaf();
    }

    getActiveViewOfType<T extends WorkspaceLeaf>(type: string): T | null {
        return this.activeLeaf?.view?.getViewType() === type ? this.activeLeaf as T : null;
    }

    removeChild(): void {
        // Implémentation simplifiée
    }

    onLayoutChange(): void {
        // Implementation
    }

    iterateRootLeaves(callback: (leaf: WorkspaceLeaf) => any): void {
        this.iterateLeaves(callback, this.rootSplit);
    }

    getLastActiveLeaf(): WorkspaceLeaf | null {
        return this.activeLeaf;
    }

    getActiveLeafOfType<T extends WorkspaceLeaf>(type: string): T | null {
        return this.getActiveViewOfType<T>(type);
    }

    openPopoutLeaf(): WorkspaceLeaf {
        return this.createLeaf();
    }
}