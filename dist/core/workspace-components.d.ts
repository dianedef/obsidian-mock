import { WorkspaceParent, WorkspaceContainer as IWorkspaceContainer, Events, WorkspaceItem as IWorkspaceItem, EventRef } from 'obsidian';
export declare class WorkspaceItem extends Events implements IWorkspaceItem {
    parent: WorkspaceParent;
    containerEl: HTMLElement;
    constructor(parent: WorkspaceParent);
    getRoot(): WorkspaceParent;
    getContainer(): IWorkspaceContainer;
    on(name: string, callback: (...data: any[]) => any, ctx?: any): EventRef;
    offref(ref: EventRef): void;
    off(name: string, callback: (...data: any[]) => any): void;
    trigger(name: string, ...data: any[]): void;
}
export declare class WorkspaceContainer extends WorkspaceItem implements IWorkspaceContainer {
    children: WorkspaceItem[];
    win: Window;
    doc: Document;
    constructor(parent: WorkspaceParent);
    getContainer(): IWorkspaceContainer;
    addChild(child: WorkspaceItem, index?: number): void;
    removeChild(child: WorkspaceItem): void;
    setChildren(children: WorkspaceItem[]): void;
    empty(): void;
}
