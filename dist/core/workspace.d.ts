import { App, TFile, View, MarkdownFileInfo, SplitDirection, PaneType, OpenViewState, Side, Workspace as IWorkspace, WorkspaceLeaf as IWorkspaceLeaf, WorkspaceItem as IWorkspaceItem, WorkspaceParent as IWorkspaceParent, WorkspaceSidedock as IWorkspaceSidedock, WorkspaceMobileDrawer as IWorkspaceMobileDrawer, Debouncer, WorkspaceWindow, WorkspaceWindowInitData } from 'obsidian';
import { WorkspaceRoot } from './workspace-root';
import { WorkspaceContainer, WorkspaceItem } from './workspace-components';
type Constructor<T> = {
    new (...args: any[]): T;
};
interface WorkspaceItemLocation {
    type: string;
    item: IWorkspaceItem;
}
export declare class Workspace extends WorkspaceItem implements IWorkspace {
    rootSplit: WorkspaceRoot;
    leftSplit: IWorkspaceSidedock;
    rightSplit: IWorkspaceSidedock;
    floatingSplit: IWorkspaceMobileDrawer | null;
    leftRibbon: HTMLElement;
    rightRibbon: HTMLElement;
    layoutReady: boolean;
    app: App;
    activeLeaf: IWorkspaceLeaf | null;
    activeEditor: MarkdownFileInfo | null;
    lastActiveLeaf: IWorkspaceLeaf | null;
    requestSaveLayout: Debouncer<[], Promise<void>>;
    on: IWorkspace["on"];
    constructor(app: App);
    getRoot(): IWorkspaceParent;
    getContainer(): WorkspaceContainer;
    private saveLayout;
    onLayoutReady(): void;
    iterateLeaves(callback: (leaf: IWorkspaceLeaf) => any, item?: IWorkspaceItem): void;
    getLeaf(newLeaf?: "split" | boolean | PaneType, direction?: SplitDirection): IWorkspaceLeaf;
    createLeafInParent(parent: WorkspaceContainer, index: number): IWorkspaceLeaf;
    splitActiveLeaf(direction?: SplitDirection): IWorkspaceLeaf;
    createLeafBySplit(leaf: IWorkspaceLeaf, direction?: SplitDirection): IWorkspaceLeaf;
    duplicateLeaf(leaf: IWorkspaceLeaf, direction?: SplitDirection): Promise<IWorkspaceLeaf>;
    duplicateLeaf(leaf: IWorkspaceLeaf, leafType: PaneType | boolean, direction?: SplitDirection): Promise<IWorkspaceLeaf>;
    moveLeafToPopout(leaf: IWorkspaceLeaf, data?: WorkspaceWindowInitData): WorkspaceWindow;
    openPopoutLeaf(data?: WorkspaceWindowInitData): IWorkspaceLeaf;
    getActiveViewOfType<T extends View>(type: Constructor<T>): T | null;
    getActiveFile(): TFile | null;
    setActiveLeaf(leaf: IWorkspaceLeaf, pushHistoryOrParams?: boolean | {
        focus?: boolean;
    }, focus?: boolean): void;
    getLeafById(id: string): IWorkspaceLeaf | null;
    getGroupLeaves(group: string): IWorkspaceLeaf[];
    getMostRecentLeaf(root?: IWorkspaceParent): IWorkspaceLeaf | null;
    getUnpinnedLeaf(): IWorkspaceLeaf;
    getLeavesOfType(viewType: string): IWorkspaceLeaf[];
    changeLayout(workspace: any): Promise<void>;
    requestSaveHistory(): Promise<void>;
    getDropLocation(_event: DragEvent): WorkspaceItemLocation | null;
    onDragStart(_event: DragEvent): void;
    onDragOver(_event: DragEvent): void;
    onDrop(_event: DragEvent): void;
    handleLinktext(_linktext: string, _sourcePath: string, _newLeaf?: boolean, _openViewState?: OpenViewState): Promise<void>;
    openLinkText(_linktext: string, _sourcePath: string, _newLeaf?: boolean, _openViewState?: OpenViewState): Promise<void>;
    loadLayout(_layout: any): Promise<void>;
    getLayout(): Record<string, unknown>;
    iterateAllLeaves(callback: (leaf: IWorkspaceLeaf) => any): void;
    getLeftLeaf(_split: boolean): IWorkspaceLeaf | null;
    getRightLeaf(_split: boolean): IWorkspaceLeaf | null;
    ensureSideLeaf(_type: string, side: Side, options?: {
        reveal?: boolean;
    }): Promise<IWorkspaceLeaf>;
    iterateRootLeaves(callback: (leaf: IWorkspaceLeaf) => any): void;
    detachLeavesOfType(viewType: string): void;
    revealLeaf(leaf: IWorkspaceLeaf): Promise<void>;
    getLastOpenFiles(): string[];
    updateOptions(): void;
    getLastActiveLeaf(): IWorkspaceLeaf | null;
}
export {};
