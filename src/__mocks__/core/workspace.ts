import { vi } from 'vitest';
import type { 
    App,
    WorkspaceLeaf as IWorkspaceLeaf,
    WorkspaceParent,
    WorkspaceItem as IWorkspaceItem,
    Workspace as IWorkspace,
    View,
    TFile,
    SplitDirection,
    PaneType,
    WorkspaceSidedock as IWorkspaceSidedock,
    WorkspaceMobileDrawer as IWorkspaceMobileDrawer,
    Constructor,
    Debouncer,
    ViewState,
    EventRef,
    Editor,
    Tasks,
    WorkspaceWindow,
    WorkspaceWindowInitData
} from 'obsidian';
import { Events } from '../components/events';
import { WorkspaceSplit } from './workspace-components';
import { WorkspaceItem } from './workspace-items';
import { WorkspaceContainer } from './workspace-container';
import { WorkspaceLeaf } from './workspace-leaf';

class WorkspaceWindowImpl extends Events implements WorkspaceWindow {
    win: Window = window;
    doc: Document = document;
    workspace: Workspace;
    leaf: WorkspaceLeaf;
    parent: WorkspaceParent;

    constructor(workspace: Workspace, leaf: WorkspaceLeaf) {
        super();
        this.workspace = workspace;
        this.leaf = leaf;
        this.parent = this.workspace.rootSplit;
    }

    getContainer(): WorkspaceWindow {
        return this;
    }

    getRoot(): WorkspaceWindow {
        return this;
    }
}

export class Workspace extends Events implements IWorkspace {
    app: App;
    containerEl: HTMLElement;
    rootSplit: WorkspaceSplit;
    leftSplit: IWorkspaceSidedock | IWorkspaceMobileDrawer;
    rightSplit: IWorkspaceSidedock | IWorkspaceMobileDrawer;
    leftRibbon: HTMLElement;
    rightRibbon: HTMLElement;
    activeLeaf: WorkspaceLeaf | null = null;
    floatingSplit: WorkspaceSplit | null = null;
    layoutReady: boolean = false;
    activeEditor: any = null;

    private history: WorkspaceLeaf[] = [];

    constructor(app: App) {
        super();
        this.app = app;
        const container = new WorkspaceContainer();
        this.containerEl = container.htmlElement;
        this.rootSplit = new WorkspaceSplit(null, app);
        
        const createSidedock = (side: 'left' | 'right'): IWorkspaceSidedock => ({
            collapsed: false,
            expand: vi.fn(),
            collapse: vi.fn(),
            toggle: vi.fn(),
            getRoot: () => this.rootSplit,
            getContainer: () => this.rootSplit,
            parent: this.rootSplit,
            on: vi.fn(),
            off: vi.fn(),
            offref: vi.fn(),
            trigger: vi.fn(),
            tryTrigger: vi.fn()
        });

        this.leftSplit = createSidedock('left');
        this.rightSplit = createSidedock('right');
        this.leftRibbon = document.createElement('div');
        this.rightRibbon = document.createElement('div');

        // Support des événements de presse-papier et de mode
        this.containerEl.addEventListener('paste', (evt: Event) => {
            if (evt instanceof ClipboardEvent) {
                this.trigger('editor-paste', evt);
            }
        });

        this.on('workspace-mode-change', (mode: string) => {
            this.containerEl.classList.remove('is-source-mode', 'is-preview-mode');
            this.containerEl.classList.add(`is-${mode}-mode`);
        });

        // Écouter les événements de suppression de feuilles
        this.rootSplit.on('leaf-deleted', (leaf: IWorkspaceLeaf) => {
            this.trigger('leaf-deleted', leaf);
        });
    }

    iterateLeaves(callback: (leaf: WorkspaceLeaf) => any): void {
        this.rootSplit.children.forEach(item => {
            if (item instanceof WorkspaceItem && 'view' in item) {
                callback(item as unknown as WorkspaceLeaf);
            }
        });
    }

    getLeaf(newLeaf?: "split" | boolean | PaneType, direction?: SplitDirection): IWorkspaceLeaf {
        let parent: WorkspaceSplit;
        if (newLeaf === true || newLeaf === "split") {
            parent = new WorkspaceSplit(null, this.app);
        } else {
            parent = this.rootSplit;
        }
        const leaf = new WorkspaceLeaf(this.app, parent);
        this.trigger('leaf-created', leaf);
        return leaf;
    }

    getMostRecentLeaf(): WorkspaceLeaf | null {
        return this.activeLeaf || this.getLeaf();
    }

    getLeftLeaf(split: boolean = false): WorkspaceLeaf {
        return this.getLeaf();
    }

    getRightLeaf(split: boolean = false): WorkspaceLeaf {
        return this.getLeaf();
    }

    createLeafInParent(parent: WorkspaceParent, index?: number): WorkspaceLeaf {
        if (parent instanceof WorkspaceSplit) {
            const leaf = this.getLeaf(true);
            parent.addLeaf(leaf, index);
            return leaf;
        }
        return this.getLeaf();
    }

    createLeafBySplit(leaf: WorkspaceLeaf, direction?: SplitDirection): WorkspaceLeaf {
        const newLeaf = this.getLeaf("split", direction);
        this.trigger('layout-change');
        return newLeaf;
    }

    setActiveLeaf(leaf: WorkspaceLeaf, params?: { focus?: boolean }): void;
    setActiveLeaf(leaf: WorkspaceLeaf, pushHistory: boolean, focus: boolean): void;
    setActiveLeaf(leaf: WorkspaceLeaf, pushHistoryOrParams?: boolean | { focus?: boolean }, focus?: boolean): void {
        const oldLeaf = this.activeLeaf;
        this.activeLeaf = leaf;
        
        const shouldPushHistory = typeof pushHistoryOrParams === 'boolean' ? pushHistoryOrParams : true;
        const shouldFocus = typeof pushHistoryOrParams === 'boolean' ? focus : pushHistoryOrParams?.focus;
        
        if (shouldPushHistory && leaf !== oldLeaf) {
            this.history.push(leaf);
        }
        
        if (shouldFocus) {
            (leaf as any).containerEl?.focus();
        }
        
        this.trigger('active-leaf-change', leaf);
    }

    getActiveLeaf(): WorkspaceLeaf | null {
        return this.activeLeaf;
    }

    getLastActiveLeaf(): WorkspaceLeaf | null {
        return this.activeLeaf;
    }

    getLeavesOfType(type?: string): WorkspaceLeaf[] {
        const leaves: WorkspaceLeaf[] = [];
        this.iterateLeaves((leaf) => {
            if (!type || leaf.view?.getViewType() === type) {
                leaves.push(leaf);
            }
        });
        return leaves;
    }

    getActiveViewOfType<T extends Constructor<View>>(type: T): InstanceType<T> | null {
        if (!this.activeLeaf || !this.activeLeaf.view) {
            return null;
        }
        return this.activeLeaf.view instanceof type ? this.activeLeaf.view as InstanceType<T> : null;
    }

    getActiveFile(): TFile | null {
        return (this.activeLeaf?.view as any)?.file || null;
    }

    async revealLeaf(leaf: WorkspaceLeaf): Promise<void> {
        if (leaf.parent) {
            this.setActiveLeaf(leaf);
        }
    }

    duplicateLeaf(leaf: WorkspaceLeaf, direction?: SplitDirection): Promise<WorkspaceLeaf>;
    duplicateLeaf(leaf: WorkspaceLeaf, leafType: boolean | PaneType, direction?: SplitDirection): Promise<WorkspaceLeaf>;
    duplicateLeaf(leaf: WorkspaceLeaf, directionOrType?: SplitDirection | boolean | PaneType, direction?: SplitDirection): Promise<WorkspaceLeaf> {
        const newLeaf = this.getLeaf(
            typeof directionOrType === 'boolean' || (directionOrType && typeof directionOrType === 'string' && directionOrType !== 'vertical' && directionOrType !== 'horizontal') ? directionOrType : true,
            typeof directionOrType === 'string' && (directionOrType === 'vertical' || directionOrType === 'horizontal') ? directionOrType : direction
        );
        
        return (async () => {
            if (leaf.view) {
                const state = await leaf.view.getState();
                await newLeaf.setViewState({ ...state, type: leaf.view.getViewType() });
            }
            return newLeaf;
        })();
    }

    detachLeavesOfType(type: string): void {
        this.getLeavesOfType(type).forEach(leaf => {
            if (leaf.parent instanceof WorkspaceSplit) {
                leaf.parent.removeChild(leaf as unknown as WorkspaceItem);
                this.trigger('leaf-deleted', leaf);
            }
        });
    }

    onLayoutReady(callback: () => any): void {
        if (this.layoutReady) {
            callback();
        } else {
            this.on('layout-ready', callback);
        }
    }

    async saveLayout(): Promise<void> {
        this.trigger('layout-save');
    }

    async loadLayout(layout: any): Promise<void> {
        // Reset current layout
        this.history = [];
        this.activeLeaf = null;
        
        // Load new layout
        this.trigger('layout-change');
        return Promise.resolve();
    }

    getLayout(): any {
        return {};
    }

    requestSaveLayout = {
        run: async () => {
            await this.saveLayout();
        },
        cancel: () => {
            return this.requestSaveLayout;
        }
    } as Debouncer<[], Promise<void>>;

    requestSaveWorkspace(): void {
        this.trigger('workspace-save');
    }

    changeLayout(workspace: any): Promise<void> {
        return this.loadLayout(workspace);
    }

    splitActiveLeaf(): WorkspaceLeaf {
        const active = this.activeLeaf;
        if (!active) return this.getLeaf();
        return this.createLeafBySplit(active);
    }

    getUnpinnedLeaf(type?: string): WorkspaceLeaf {
        const leaves = this.getLeavesOfType(type);
        return leaves.find(leaf => !(leaf as any).pinned) || this.getLeaf();
    }

    iterateRootLeaves(callback: (leaf: WorkspaceLeaf) => any): void {
        if (this.rootSplit) {
            this.rootSplit.children.forEach(child => {
                if ('view' in child && 'setViewState' in child) {
                    callback(child as unknown as WorkspaceLeaf);
                }
            });
        }
    }

    iterateAllLeaves(callback: (leaf: WorkspaceLeaf) => any): void {
        this.iterateRootLeaves(callback);
        if (this.leftSplit) {
            (this.leftSplit as unknown as WorkspaceSplit).children.forEach(child => {
                if ('view' in child && 'setViewState' in child) {
                    callback(child as unknown as WorkspaceLeaf);
                }
            });
        }
        if (this.rightSplit) {
            (this.rightSplit as unknown as WorkspaceSplit).children.forEach(child => {
                if ('view' in child && 'setViewState' in child) {
                    callback(child as unknown as WorkspaceLeaf);
                }
            });
        }
    }

    moveLeafToPopout(leaf: WorkspaceLeaf, data?: WorkspaceWindowInitData): WorkspaceWindow {
        const win = new WorkspaceWindowImpl(this, leaf);
        this.trigger('window-open', win);
        return win;
    }

    openLinkText(linktext: string, sourcePath: string, newLeaf?: boolean | PaneType, openViewState?: ViewState): Promise<void> {
        const leaf = newLeaf ? this.getLeaf(newLeaf) : this.getLeaf();
        return leaf.setViewState(openViewState || { type: 'markdown', state: { file: linktext } });
    }

    openPopoutLeaf(data?: WorkspaceWindowInitData): WorkspaceLeaf {
        const leaf = this.getLeaf();
        const win = this.moveLeafToPopout(leaf, data);
        return leaf;
    }

    getGroupLeaves(group: string): WorkspaceLeaf[] {
        return this.getLeavesOfType().filter(leaf => (leaf as any).group === group);
    }

    getLastOpenFiles(): string[] {
        return this.history
            .map(leaf => (leaf.view as any)?.file?.path)
            .filter(path => path) as string[];
    }

    getLeafById(id: string): WorkspaceLeaf | null {
        let result: WorkspaceLeaf | null = null;
        this.iterateAllLeaves(leaf => {
            if ((leaf as any).id === id) {
                result = leaf;
            }
        });
        return result;
    }

    async ensureSideLeaf(type: string, side: 'left' | 'right', options: { active?: boolean, split?: boolean, reveal?: boolean, state?: any } = {}): Promise<WorkspaceLeaf> {
        const split = side === 'left' ? this.leftSplit : this.rightSplit;
        let leaf = this.getLeavesOfType(type).find(l => l.parent === split);
        
        if (!leaf) {
            leaf = this.getLeaf(options.split);
            await leaf.setViewState({ type, active: true, ...options.state });
            
            if (options.reveal) {
                await this.revealLeaf(leaf);
            }
        }
        
        if (options.active) {
            this.setActiveLeaf(leaf);
        }
        
        return leaf;
    }

    updateOptions(): void {
        this.trigger('options-update');
    }

    detachLeaf(leaf: WorkspaceLeaf): void {
        this.history = this.history.filter(l => l !== leaf);
        if (this.activeLeaf === leaf) {
            this.activeLeaf = this.history[this.history.length - 1] || null;
        }
        this.trigger('leaf-deleted', leaf);
    }
}