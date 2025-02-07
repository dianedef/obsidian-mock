import { WorkspaceRoot } from './workspace-root';
import { WorkspaceSidedock } from './workspace-sidedock';
import { WorkspaceLeaf } from '../workspace-leaf';
import { WorkspaceItem } from './workspace-components';
export class Workspace extends WorkspaceItem {
    constructor(app) {
        super(app);
        this.floatingSplit = null;
        this.layoutReady = false;
        this.activeLeaf = null;
        this.activeEditor = null;
        this.lastActiveLeaf = null;
        // Utilisation d'un type d'union pour la méthode on
        this.on = ((name, callback, ctx) => {
            super.on(name, callback, ctx);
            return { id: '1', type: name };
        });
        this.app = app;
        this.rootSplit = new WorkspaceRoot(app, this);
        this.leftSplit = Object.assign(new WorkspaceSidedock('left', this, app), {
            collapsed: false,
            toggle: () => { this.leftSplit.collapsed = !this.leftSplit.collapsed; },
            expand: () => { this.leftSplit.collapsed = false; },
            collapse: () => { this.leftSplit.collapsed = true; }
        });
        this.rightSplit = Object.assign(new WorkspaceSidedock('right', this, app), {
            collapsed: false,
            toggle: () => { this.rightSplit.collapsed = !this.rightSplit.collapsed; },
            expand: () => { this.rightSplit.collapsed = false; },
            collapse: () => { this.rightSplit.collapsed = true; }
        });
        this.leftRibbon = document.createElement('div');
        this.rightRibbon = document.createElement('div');
        this.requestSaveLayout = {
            run: async () => {
                await this.saveLayout();
                return Promise.resolve();
            },
            cancel: () => { }
        };
    }
    getRoot() {
        return this;
    }
    getContainer() {
        return this.rootSplit;
    }
    async saveLayout() {
        const layout = this.getLayout();
        this.trigger('layout-change', layout);
        return Promise.resolve();
    }
    onLayoutReady() {
        this.layoutReady = true;
        this.trigger('layout-ready');
    }
    iterateLeaves(callback, item) {
        if (!item) {
            item = this.rootSplit;
        }
        if ('view' in item) {
            callback(item);
        }
        else if ('children' in item) {
            const container = item;
            container.children.forEach(child => this.iterateLeaves(callback, child));
        }
    }
    getLeaf(newLeaf = true, direction) {
        if (!this.rootSplit) {
            throw new Error('No root split found');
        }
        if (newLeaf === 'split') {
            return this.splitActiveLeaf(direction);
        }
        if (newLeaf === true || newLeaf === 'tab') {
            return this.createLeafInParent(this.rootSplit, this.rootSplit.children.length);
        }
        let leaf = this.getUnpinnedLeaf();
        if (!leaf) {
            leaf = this.createLeafInParent(this.rootSplit, this.rootSplit.children.length);
        }
        return leaf;
    }
    createLeafInParent(parent, index) {
        const leaf = new WorkspaceLeaf(parent);
        parent.addChild(leaf, index);
        return leaf;
    }
    splitActiveLeaf(direction) {
        if (!this.activeLeaf) {
            return this.getLeaf(true);
        }
        return this.createLeafBySplit(this.activeLeaf, direction);
    }
    createLeafBySplit(leaf, direction = 'vertical') {
        const parent = leaf.parent;
        const newLeaf = new WorkspaceLeaf(parent);
        parent.addChild(newLeaf);
        return newLeaf;
    }
    async duplicateLeaf(leaf, leafTypeOrDirection, direction) {
        let newLeaf;
        if (typeof leafTypeOrDirection === 'string' && (leafTypeOrDirection === 'vertical' || leafTypeOrDirection === 'horizontal')) {
            newLeaf = this.createLeafBySplit(leaf, leafTypeOrDirection);
        }
        else {
            const leafType = leafTypeOrDirection;
            newLeaf = leafType === 'split'
                ? this.createLeafBySplit(leaf, direction || 'vertical')
                : this.getLeaf(leafType);
        }
        if (leaf.view) {
            const state = leaf.view.getState();
            await newLeaf.setViewState({
                type: leaf.view.getViewType(),
                state: { ...state }
            });
        }
        return newLeaf;
    }
    moveLeafToPopout(leaf, data) {
        const workspaceWindow = {
            win: window,
            workspace: this,
            leaf: leaf,
            doc: document,
            parent: null,
            containerEl: document.createElement('div'),
            getRoot: () => this.rootSplit,
            getContainer: () => this.rootSplit,
            on: (_name, _callback) => {
                return {};
            },
            offref: (_ref) => { },
            children: []
        };
        if (data) {
            Object.assign(workspaceWindow, data);
        }
        return workspaceWindow;
    }
    openPopoutLeaf(data) {
        const leaf = this.getLeaf(true);
        this.moveLeafToPopout(leaf, data);
        return leaf;
    }
    getActiveViewOfType(type) {
        if (!this.activeLeaf?.view) {
            return null;
        }
        return this.activeLeaf.view instanceof type ? this.activeLeaf.view : null;
    }
    getActiveFile() {
        const view = this.activeLeaf?.view;
        if (view && 'file' in view) {
            return view.file;
        }
        return null;
    }
    setActiveLeaf(leaf, pushHistoryOrParams, focus) {
        const oldLeaf = this.activeLeaf;
        this.lastActiveLeaf = oldLeaf;
        this.activeLeaf = leaf;
        if (oldLeaf !== leaf) {
            this.trigger('active-leaf-change', leaf);
        }
        const shouldFocus = typeof pushHistoryOrParams === 'object'
            ? pushHistoryOrParams.focus ?? focus
            : focus ?? pushHistoryOrParams;
        if (shouldFocus) {
            leaf.view?.containerEl.focus();
        }
    }
    getLeafById(id) {
        let foundLeaf = null;
        this.iterateAllLeaves((leaf) => {
            if (leaf.id === id) {
                foundLeaf = leaf;
                return true;
            }
            return false;
        });
        return foundLeaf;
    }
    getGroupLeaves(group) {
        const leaves = [];
        this.iterateAllLeaves((leaf) => {
            if (leaf.group === group) {
                leaves.push(leaf);
            }
        });
        return leaves;
    }
    getMostRecentLeaf(root = this.rootSplit) {
        let mostRecent = null;
        let mostRecentTime = 0;
        this.iterateLeaves((leaf) => {
            const time = leaf.lastAccessed || 0;
            if (time > mostRecentTime) {
                mostRecent = leaf;
                mostRecentTime = time;
            }
        }, root);
        return mostRecent;
    }
    getUnpinnedLeaf() {
        let unpinnedLeaf = null;
        this.iterateLeaves(leaf => {
            if (!unpinnedLeaf && leaf instanceof WorkspaceLeaf && !leaf.pinned) {
                unpinnedLeaf = leaf;
            }
        });
        return unpinnedLeaf || this.getLeaf(true);
    }
    getLeavesOfType(viewType) {
        const leaves = [];
        this.iterateLeaves(leaf => {
            if (leaf.view?.getViewType() === viewType) {
                leaves.push(leaf);
            }
        });
        return leaves;
    }
    async changeLayout(workspace) {
        if (!workspace || typeof workspace !== 'object') {
            return;
        }
        // Sauvegarder l'état actuel avant de changer
        const oldLayout = await this.getLayout();
        try {
            await this.loadLayout(workspace);
            this.trigger('layout-change');
        }
        catch (error) {
            // En cas d'erreur, essayer de restaurer l'ancien layout
            console.error('Failed to change layout:', error);
            await this.loadLayout(oldLayout);
        }
    }
    async requestSaveHistory() {
        // Implementation
    }
    getDropLocation(_event) {
        // TODO: Implement drop location detection
        return null;
    }
    onDragStart(_event) {
        // TODO: Implement drag start handling
    }
    onDragOver(_event) {
        // TODO: Implement drag over handling
    }
    onDrop(_event) {
        // TODO: Implement drop handling
    }
    handleLinktext(_linktext, _sourcePath, _newLeaf, _openViewState) {
        // TODO: Implement link text handling
        return Promise.resolve();
    }
    openLinkText(_linktext, _sourcePath, _newLeaf, _openViewState) {
        // TODO: Implement link text opening
        return Promise.resolve();
    }
    loadLayout(_layout) {
        // TODO: Implement layout loading
        return Promise.resolve();
    }
    getLayout() {
        return {
            main: {
                type: 'split',
                direction: 'vertical',
                children: []
            }
        };
    }
    iterateAllLeaves(callback) {
        this.iterateLeaves(callback);
    }
    getLeftLeaf(_split) {
        return null;
    }
    getRightLeaf(_split) {
        return null;
    }
    async ensureSideLeaf(_type, side, options) {
        return {};
    }
    iterateRootLeaves(callback) {
        this.iterateLeaves(callback, this.rootSplit);
    }
    detachLeavesOfType(viewType) {
        this.getLeavesOfType(viewType).forEach(leaf => leaf.detach());
    }
    async revealLeaf(leaf) {
        if (leaf.parent) {
            this.setActiveLeaf(leaf, true);
        }
    }
    getLastOpenFiles() {
        // TODO: Implement
        return [];
    }
    updateOptions() {
        // TODO: Implement
    }
    getLastActiveLeaf() {
        return this.lastActiveLeaf;
    }
}
