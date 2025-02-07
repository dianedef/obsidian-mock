import { App, Events } from 'obsidian';
import type { WorkspaceParent as IWorkspaceParent, WorkspaceContainer as IWorkspaceContainer, WorkspaceSidedock as IWorkspaceSidedock, WorkspaceRoot as IWorkspaceRoot, WorkspaceLeaf as IWorkspaceLeaf, WorkspaceMobileDrawer as IWorkspaceMobileDrawer } from 'obsidian';
export declare class WorkspaceRoot extends Events implements IWorkspaceRoot, IWorkspaceContainer {
    app: App;
    containerEl: HTMLElement;
    win: Window;
    doc: Document;
    children: IWorkspaceLeaf[];
    activeLeaf: IWorkspaceLeaf | null;
    parent: IWorkspaceParent;
    constructor(app: App);
    getRoot(): IWorkspaceContainer;
    getContainer(): IWorkspaceContainer;
    addChild(child: IWorkspaceLeaf, index?: number): void;
    removeChild(child: IWorkspaceLeaf): void;
    setActiveLeaf(leaf: IWorkspaceLeaf | null): void;
    getActiveLeaf(): IWorkspaceLeaf | null;
    createLeaf(): IWorkspaceLeaf;
}
export declare class WorkspaceSidedock extends Events implements IWorkspaceSidedock {
    containerEl: HTMLElement;
    win: Window;
    doc: Document;
    children: IWorkspaceLeaf[];
    collapsed: boolean;
    parent: IWorkspaceParent;
    side: 'left' | 'right';
    constructor(parent: IWorkspaceParent, app: App, side: 'left' | 'right');
    getRoot(): IWorkspaceContainer;
    getContainer(): IWorkspaceContainer;
    addChild(child: IWorkspaceLeaf): void;
    removeChild(child: IWorkspaceLeaf): void;
    expand(): void;
    collapse(): void;
    toggle(): void;
}
export declare class WorkspaceMobileDrawer extends Events implements IWorkspaceMobileDrawer {
    containerEl: HTMLElement;
    win: Window;
    doc: Document;
    children: IWorkspaceLeaf[];
    collapsed: boolean;
    parent: IWorkspaceParent;
    constructor(parent: IWorkspaceParent, app: App);
    getRoot(): IWorkspaceContainer;
    getContainer(): IWorkspaceContainer;
    addChild(child: IWorkspaceLeaf): void;
    removeChild(child: IWorkspaceLeaf): void;
    expand(): void;
    collapse(): void;
    toggle(): void;
}
