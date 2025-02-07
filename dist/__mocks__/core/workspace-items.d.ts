import { Events } from '../components/events';
import type { WorkspaceItem as IWorkspaceItem, WorkspaceContainer as IWorkspaceContainer, WorkspaceParent, WorkspaceSplit as IWorkspaceSplit } from 'obsidian';
import { WorkspaceTabs as WorkspaceTabsBase } from './workspace-components';
export declare class WorkspaceItem extends Events implements IWorkspaceItem {
    parent: WorkspaceParent;
    type: string;
    constructor(parent: WorkspaceParent);
    getRoot(): WorkspaceParent;
    getContainer(): IWorkspaceContainer;
}
export declare class WorkspaceSplit extends WorkspaceItem implements IWorkspaceSplit {
    children: IWorkspaceItem[];
    type: string;
    constructor(parent: WorkspaceParent);
    addChild(child: IWorkspaceItem, index?: number): void;
    removeChild(child: IWorkspaceItem): void;
}
export { WorkspaceTabsBase as WorkspaceTabs };
export declare class WorkspaceContainer extends WorkspaceSplit implements IWorkspaceContainer {
    win: Window;
    doc: Document;
    containerEl: HTMLElement;
    constructor(parent: WorkspaceParent);
    getContainer(): IWorkspaceContainer;
}
export declare class WorkspaceFloating extends WorkspaceSplit {
    constructor(parent: WorkspaceParent);
}
