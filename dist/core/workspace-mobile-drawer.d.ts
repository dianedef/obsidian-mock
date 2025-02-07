import { App, WorkspaceMobileDrawer as IWorkspaceMobileDrawer, WorkspaceItem, WorkspaceContainer } from 'obsidian';
import { WorkspaceItemBase } from './workspace-item-base';
export declare class WorkspaceMobileDrawer extends WorkspaceItemBase implements IWorkspaceMobileDrawer {
    type: string;
    containerEl: HTMLElement;
    children: WorkspaceItem[];
    private _parent;
    constructor(rootSplit: WorkspaceItem, app: App);
    get parent(): WorkspaceItem;
    set parent(value: WorkspaceItem);
    getRoot(): WorkspaceItem;
    getContainer(): WorkspaceContainer;
    collapse(): void;
    expand(): void;
    toggle(): void;
    addChild(child: WorkspaceItem, index?: number): void;
    removeChild(child: WorkspaceItem): void;
    get collapsed(): boolean;
    set collapsed(value: boolean);
}
