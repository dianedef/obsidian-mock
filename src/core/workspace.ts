import { 
    App,
    Events,
    TFile,
    View,
    MarkdownFileInfo,
    SplitDirection,
    PaneType,
    OpenViewState,
    Side,
    Workspace as IWorkspace,
    WorkspaceLeaf as IWorkspaceLeaf,
    WorkspaceItem as IWorkspaceItem,
    WorkspaceParent as IWorkspaceParent,
    WorkspaceRoot as IWorkspaceRoot,
    WorkspaceSidedock as IWorkspaceSidedock,
    WorkspaceMobileDrawer as IWorkspaceMobileDrawer,
    Debouncer,
    WorkspaceWindow,
    WorkspaceWindowInitData,
    EventRef,
    Scope
} from 'obsidian';
import { WorkspaceRoot } from './workspace-root';
import { WorkspaceSidedock } from './workspace-sidedock';
import { WorkspaceLeaf } from '../workspace-leaf';
import { WorkspaceContainer, WorkspaceItem } from './workspace-components';
import { MockEventRef } from '../components/events';

type Constructor<T> = { new (...args: any[]): T };

interface DragData {
    source: string;
    type: string;
}

interface WorkspaceItemLocation {
    type: string;
    item: IWorkspaceItem;
}

export class Workspace extends WorkspaceItem implements IWorkspace {
    rootSplit: WorkspaceRoot;
    leftSplit: IWorkspaceSidedock;
    rightSplit: IWorkspaceSidedock;
    floatingSplit: IWorkspaceMobileDrawer | null = null;
    leftRibbon: HTMLElement;
    rightRibbon: HTMLElement;
    layoutReady: boolean = false;
    app: App;
    activeLeaf: IWorkspaceLeaf | null = null;
    activeEditor: MarkdownFileInfo | null = null;
    lastActiveLeaf: IWorkspaceLeaf | null = null;

    requestSaveLayout: Debouncer<[], Promise<void>>;

    // Utilisation d'un type d'union pour la méthode on
    on = ((name: string, callback: (...data: any[]) => any, ctx?: any): EventRef => {
        super.on(name, callback, ctx);
        return { id: '1', type: name } as unknown as EventRef;
    }) as IWorkspace['on'];

    constructor(app: App) {
        super(app as unknown as IWorkspaceParent);
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
            cancel: () => {}
        } as Debouncer<[], Promise<void>>;
    }

    getRoot(): IWorkspaceParent {
        return this;
    }

    getContainer(): WorkspaceContainer {
        return this.rootSplit;
    }

    private async saveLayout(): Promise<void> {
        const layout = this.getLayout();
        this.trigger('layout-change', layout);
        return Promise.resolve();
    }

    onLayoutReady(): void {
        this.layoutReady = true;
        this.trigger('layout-ready');
    }

    iterateLeaves(callback: (leaf: IWorkspaceLeaf) => any, item?: IWorkspaceItem): void {
        if (!item) {
            item = this.rootSplit;
        }
        if ('view' in item) {
            callback(item as IWorkspaceLeaf);
        } else if ('children' in item) {
            const container = item as WorkspaceContainer;
            container.children.forEach(child => this.iterateLeaves(callback, child));
        }
    }

    getLeaf(newLeaf: "split" | boolean | PaneType = true, direction?: SplitDirection): IWorkspaceLeaf {
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

    createLeafInParent(parent: WorkspaceContainer, index: number): IWorkspaceLeaf {
        const leaf = new WorkspaceLeaf(parent);
        parent.addChild(leaf, index);
        return leaf;
    }

    splitActiveLeaf(direction?: SplitDirection): IWorkspaceLeaf {
        if (!this.activeLeaf) {
            return this.getLeaf(true);
        }
        return this.createLeafBySplit(this.activeLeaf, direction);
    }

    createLeafBySplit(leaf: IWorkspaceLeaf, direction: SplitDirection = 'vertical'): IWorkspaceLeaf {
        const parent = leaf.parent as WorkspaceContainer;
        const newLeaf = new WorkspaceLeaf(parent);
        parent.addChild(newLeaf);
        return newLeaf;
    }

    async duplicateLeaf(leaf: IWorkspaceLeaf, direction?: SplitDirection): Promise<IWorkspaceLeaf>;
    async duplicateLeaf(leaf: IWorkspaceLeaf, leafType: PaneType | boolean, direction?: SplitDirection): Promise<IWorkspaceLeaf>;
    async duplicateLeaf(
        leaf: IWorkspaceLeaf,
        leafTypeOrDirection?: PaneType | boolean | SplitDirection,
        direction?: SplitDirection
    ): Promise<IWorkspaceLeaf> {
        let newLeaf: IWorkspaceLeaf;

        if (typeof leafTypeOrDirection === 'string' && (leafTypeOrDirection === 'vertical' || leafTypeOrDirection === 'horizontal')) {
            newLeaf = this.createLeafBySplit(leaf, leafTypeOrDirection);
        } else {
            const leafType = leafTypeOrDirection as PaneType | boolean;
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

    moveLeafToPopout(leaf: IWorkspaceLeaf, data?: WorkspaceWindowInitData): WorkspaceWindow {
        const workspaceWindow = {
            win: window,
            workspace: this,
            leaf: leaf,
            doc: document,
            parent: null,
            containerEl: document.createElement('div'),
            getRoot: () => this.rootSplit,
            getContainer: () => this.rootSplit,
            on: (_name: string, _callback: (...data: any[]) => any): EventRef => {
                return {} as EventRef;
            },
            offref: (_ref: EventRef) => {},
            children: []
        } as unknown as WorkspaceWindow;

        if (data) {
            Object.assign(workspaceWindow, data);
        }

        return workspaceWindow;
    }

    openPopoutLeaf(data?: WorkspaceWindowInitData): IWorkspaceLeaf {
        const leaf = this.getLeaf(true);
        this.moveLeafToPopout(leaf, data);
        return leaf;
    }

    getActiveViewOfType<T extends View>(type: Constructor<T>): T | null {
        if (!this.activeLeaf?.view) {
            return null;
        }
        return this.activeLeaf.view instanceof type ? this.activeLeaf.view as T : null;
    }

    getActiveFile(): TFile | null {
        const view = this.activeLeaf?.view;
        if (view && 'file' in view) {
            return (view as any).file as TFile;
        }
        return null;
    }

    setActiveLeaf(leaf: IWorkspaceLeaf, pushHistoryOrParams?: boolean | { focus?: boolean }, focus?: boolean): void {
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

    getLeafById(id: string): IWorkspaceLeaf | null {
        let foundLeaf: IWorkspaceLeaf | null = null;
        this.iterateAllLeaves((leaf) => {
            if ((leaf as any).id === id) {
                foundLeaf = leaf;
                return true;
            }
            return false;
        });
        return foundLeaf;
    }

    getGroupLeaves(group: string): IWorkspaceLeaf[] {
        const leaves: IWorkspaceLeaf[] = [];
        this.iterateAllLeaves((leaf) => {
            if ((leaf as any).group === group) {
                leaves.push(leaf);
            }
        });
        return leaves;
    }

    getMostRecentLeaf(root: IWorkspaceParent = this.rootSplit): IWorkspaceLeaf | null {
        let mostRecent: IWorkspaceLeaf | null = null;
        let mostRecentTime = 0;
        
        this.iterateLeaves((leaf) => {
            const time = (leaf as any).lastAccessed || 0;
            if (time > mostRecentTime) {
                mostRecent = leaf;
                mostRecentTime = time;
            }
        }, root);
        
        return mostRecent;
    }

    getUnpinnedLeaf(): IWorkspaceLeaf {
        let unpinnedLeaf: IWorkspaceLeaf | null = null;
        this.iterateLeaves(leaf => {
            if (!unpinnedLeaf && leaf instanceof WorkspaceLeaf && !leaf.pinned) {
                unpinnedLeaf = leaf;
            }
        });
        return unpinnedLeaf || this.getLeaf(true);
    }

    getLeavesOfType(viewType: string): IWorkspaceLeaf[] {
        const leaves: IWorkspaceLeaf[] = [];
        this.iterateLeaves(leaf => {
            if (leaf.view?.getViewType() === viewType) {
                leaves.push(leaf);
            }
        });
        return leaves;
    }

    async changeLayout(workspace: any): Promise<void> {
        if (!workspace || typeof workspace !== 'object') {
            return;
        }
        
        // Sauvegarder l'état actuel avant de changer
        const oldLayout = await this.getLayout();
        
        try {
            await this.loadLayout(workspace);
            this.trigger('layout-change');
        } catch (error) {
            // En cas d'erreur, essayer de restaurer l'ancien layout
            console.error('Failed to change layout:', error);
            await this.loadLayout(oldLayout);
        }
    }

    async requestSaveHistory(): Promise<void> {
        // Implementation
    }

    getDropLocation(_event: DragEvent): WorkspaceItemLocation | null {
        // TODO: Implement drop location detection
        return null;
    }

    onDragStart(_event: DragEvent): void {
        // TODO: Implement drag start handling
    }

    onDragOver(_event: DragEvent): void {
        // TODO: Implement drag over handling
    }

    onDrop(_event: DragEvent): void {
        // TODO: Implement drop handling
    }

    handleLinktext(_linktext: string, _sourcePath: string, _newLeaf?: boolean, _openViewState?: OpenViewState): Promise<void> {
        // TODO: Implement link text handling
        return Promise.resolve();
    }

    openLinkText(_linktext: string, _sourcePath: string, _newLeaf?: boolean, _openViewState?: OpenViewState): Promise<void> {
        // TODO: Implement link text opening
        return Promise.resolve();
    }

    loadLayout(_layout: any): Promise<void> {
        // TODO: Implement layout loading
        return Promise.resolve();
    }

    getLayout(): Record<string, unknown> {
        return {
            main: {
                type: 'split',
                direction: 'vertical',
                children: []
            }
        };
    }

    iterateAllLeaves(callback: (leaf: IWorkspaceLeaf) => any): void {
        this.iterateLeaves(callback);
    }

    getLeftLeaf(_split: boolean): IWorkspaceLeaf | null {
        return null;
    }

    getRightLeaf(_split: boolean): IWorkspaceLeaf | null {
        return null;
    }

    async ensureSideLeaf(_type: string, side: Side, options?: {
        reveal?: boolean;
    }): Promise<IWorkspaceLeaf> {
        return {} as IWorkspaceLeaf;
    }

    iterateRootLeaves(callback: (leaf: IWorkspaceLeaf) => any): void {
        this.iterateLeaves(callback, this.rootSplit);
    }

    detachLeavesOfType(viewType: string): void {
        this.getLeavesOfType(viewType).forEach(leaf => leaf.detach());
    }

    async revealLeaf(leaf: IWorkspaceLeaf): Promise<void> {
        if (leaf.parent) {
            this.setActiveLeaf(leaf, true);
        }
    }

    getLastOpenFiles(): string[] {
        // TODO: Implement
        return [];
    }

    updateOptions(): void {
        // TODO: Implement
    }

    getLastActiveLeaf(): IWorkspaceLeaf | null {
        return this.lastActiveLeaf;
    }
}

