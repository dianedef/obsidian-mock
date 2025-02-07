import { vi } from 'vitest';
import { WorkspaceSplit } from './workspace-components';
import { Events as EventsImpl } from '../components/events';
// Mock de la classe Scope
class Scope {
    constructor() {
        this.register = vi.fn();
        this.unregister = vi.fn();
    }
}
// Create a basic View mock
const createBasicView = (app) => {
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
    view.view = {
        getViewType: () => 'markdown'
    };
    return view;
};
// Create a basic WorkspaceLeaf mock
const createBasicLeaf = (app) => {
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
        setParent: vi.fn().mockImplementation((parent) => {
            leaf.parent = parent;
        }),
        getWindow: () => window,
        getIcon: () => 'document',
        onResize: vi.fn(),
        offref: vi.fn(),
        tryTrigger: vi.fn()
    };
    leaf.view.leaf = leaf;
    return leaf;
};
export class MockWorkspace extends EventsImpl {
    constructor(app) {
        super();
        this.leftSplit = null;
        this.rightSplit = null;
        this.floatingSplit = null;
        this.activeLeaf = null;
        this.layoutReady = false;
        this.app = app;
        this.rootSplit = new WorkspaceSplit(null, app);
        this.leftSplit = new WorkspaceSplit(this.rootSplit, app);
        this.rightSplit = new WorkspaceSplit(this.rootSplit, app);
        this.floatingSplit = new WorkspaceSplit(null, app);
        this.leftRibbon = document.createElement('div');
        this.rightRibbon = document.createElement('div');
        this.containerEl = document.createElement('div');
    }
    getLeaf() {
        return this.rootSplit.getLeaf();
    }
    getLeftLeaf() {
        return this.leftSplit?.getLeaf() || this.getLeaf();
    }
    getRightLeaf() {
        return this.rightSplit?.getLeaf() || this.getLeaf();
    }
    createLeafInParent(parent) {
        if (parent instanceof WorkspaceSplit) {
            return parent.getLeaf();
        }
        return this.getLeaf();
    }
    setActiveLeaf(leaf) {
        this.activeLeaf = leaf;
    }
    splitLeaf(_leaf, newLeaf) {
        return newLeaf;
    }
    async duplicateLeaf(leaf) {
        return this.createLeafInParent(leaf.parent);
    }
    iterateLeaves(callback, item) {
        const stack = [item || this.rootSplit];
        while (stack.length > 0) {
            const current = stack.pop();
            if (!current)
                continue;
            if ('view' in current && current.view) {
                callback(current);
            }
        }
    }
    getLeavesOfType(type) {
        const leaves = [];
        this.iterateLeaves((leaf) => {
            if (leaf.view && leaf.view.getViewType() === type) {
                leaves.push(leaf);
            }
        });
        return leaves;
    }
    detachLeavesOfType(type) {
        this.getLeavesOfType(type).forEach(() => {
            // Ne rien faire pour le moment
        });
    }
    moveLeafToPopout() {
        // Implémentation simplifiée
    }
    getAncestorOfType(el) {
        let current = el;
        while (current && current !== document.body) {
            const leaf = current._leaf;
            if (leaf && 'view' in leaf && leaf.view) {
                return leaf;
            }
            current = current.parentElement;
        }
        return null;
    }
    async saveLayout() {
        // Implementation
    }
    async loadLayout() {
        // Implementation
    }
    createLeaf() {
        return this.getLeaf();
    }
    getActiveViewOfType(type) {
        return this.activeLeaf?.view?.getViewType() === type ? this.activeLeaf : null;
    }
    removeChild() {
        // Implémentation simplifiée
    }
    onLayoutChange() {
        // Implementation
    }
    iterateRootLeaves(callback) {
        this.iterateLeaves(callback, this.rootSplit);
    }
    getLastActiveLeaf() {
        return this.activeLeaf;
    }
    getActiveLeafOfType(type) {
        return this.getActiveViewOfType(type);
    }
    openPopoutLeaf() {
        return this.createLeaf();
    }
}
