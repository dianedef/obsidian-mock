import { WorkspaceItem, WorkspaceParent, WorkspaceContainer } from 'obsidian';
export declare class WorkspaceSplit extends WorkspaceParent {
    containerEl: HTMLElement;
    children: WorkspaceItem[];
    direction: 'horizontal' | 'vertical';
    parent: WorkspaceParent;
    constructor(parent: WorkspaceParent | null);
    getRoot(): WorkspaceItem;
    getContainer(): WorkspaceContainer;
    addChild(child: WorkspaceItem, index?: number): void;
    insertChild(index: number, child: WorkspaceItem): void;
    removeChild(child: WorkspaceItem): void;
    replaceChild(oldChild: WorkspaceItem, newChild: WorkspaceItem): void;
    setDirection(direction: 'horizontal' | 'vertical'): void;
}
