import { vi } from 'vitest';
import { Events } from 'obsidian';
// Mock de la classe Scope
class MockScope {
    constructor() {
        this.register = vi.fn();
        this.unregister = vi.fn();
    }
}
// Create a basic View mock
const createBasicView = (app) => {
    const scope = new MockScope();
    const view = {
        getViewType: vi.fn().mockReturnValue('markdown'),
        getState: vi.fn().mockReturnValue({ type: 'markdown' }),
        getEphemeralState: vi.fn().mockReturnValue({}),
        setState: vi.fn(),
        setEphemeralState: vi.fn(),
        leaf: null,
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
    return view;
};
// Create a basic WorkspaceLeaf mock
const createBasicLeaf = (app) => {
    const view = createBasicView(app);
    const leaf = {
        view,
        containerEl: document.createElement('div'),
        width: 0,
        height: 0,
        parent: null,
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
    return leaf;
};
export class WorkspaceRoot extends Events {
    constructor(app) {
        super();
        this.app = app;
        this.containerEl = document.createElement('div');
        this.win = window;
        this.doc = document;
        this.children = [];
        this.activeLeaf = null;
        this.parent = this;
    }
    getRoot() {
        return this;
    }
    getContainer() {
        return this;
    }
    addChild(child, index) {
        if (typeof index === 'number') {
            this.children.splice(index, 0, child);
        }
        else {
            this.children.push(child);
        }
        child.parent = this;
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
    setActiveLeaf(leaf) {
        this.activeLeaf = leaf;
        this.trigger('active-leaf-change', leaf);
    }
    getActiveLeaf() {
        return this.activeLeaf;
    }
    createLeaf() {
        const leaf = createBasicLeaf(this.app);
        leaf.parent = this;
        this.children.push(leaf);
        return leaf;
    }
}
export class WorkspaceSidedock extends Events {
    constructor(parent, app, side) {
        super();
        this.containerEl = document.createElement('div');
        this.win = window;
        this.doc = document;
        this.children = [];
        this.collapsed = false;
        this.parent = parent;
        this.side = side;
    }
    getRoot() {
        return this.parent.getRoot();
    }
    getContainer() {
        return this.parent.getContainer();
    }
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
    expand() {
        this.collapsed = false;
        this.trigger('collapse-change', false);
    }
    collapse() {
        this.collapsed = true;
        this.trigger('collapse-change', true);
    }
    toggle() {
        this.collapsed = !this.collapsed;
        this.trigger('collapse-change', this.collapsed);
    }
}
export class WorkspaceMobileDrawer extends Events {
    constructor(parent, app) {
        super();
        this.containerEl = document.createElement('div');
        this.win = window;
        this.doc = document;
        this.children = [];
        this.collapsed = false;
        this.parent = parent;
    }
    getRoot() {
        return this.parent.getRoot();
    }
    getContainer() {
        return this.parent.getContainer();
    }
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
    expand() {
        this.collapsed = false;
        this.trigger('collapse-change', false);
    }
    collapse() {
        this.collapsed = true;
        this.trigger('collapse-change', true);
    }
    toggle() {
        if (this.collapsed) {
            this.expand();
        }
        else {
            this.collapse();
        }
    }
}
