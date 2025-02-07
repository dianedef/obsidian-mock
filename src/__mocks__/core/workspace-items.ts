import { vi } from 'vitest';
import { Events } from '../components/events';
import type { 
    WorkspaceItem as IWorkspaceItem,
    WorkspaceContainer as IWorkspaceContainer,
    WorkspaceTabs as IWorkspaceTabs,
    WorkspaceMobileDrawer,
    WorkspaceParent,
    WorkspaceSplit as IWorkspaceSplit
} from 'obsidian';
import { WorkspaceTabs as WorkspaceTabsBase } from './workspace-components';

export class WorkspaceItem extends Events implements IWorkspaceItem {
    parent: WorkspaceParent;
    type: string = 'item';

    constructor(parent: WorkspaceParent) {
        super();
        this.parent = parent;
    }

    getRoot(): WorkspaceParent {
        return this.parent.getRoot();
    }

    getContainer(): IWorkspaceContainer {
        return this.parent.getContainer();
    }
}

export class WorkspaceSplit extends WorkspaceItem implements IWorkspaceSplit {
    children: IWorkspaceItem[] = [];
    type: string = 'split';

    constructor(parent: WorkspaceParent) {
        super(parent);
    }

    addChild(child: IWorkspaceItem, index?: number): void {
        if (typeof index === 'number') {
            this.children.splice(index, 0, child);
        } else {
            this.children.push(child);
        }
        (child as any).parent = this;
    }

    removeChild(child: IWorkspaceItem): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            (child as any).parent = this.getRoot();
        }
    }
}

export { WorkspaceTabsBase as WorkspaceTabs };

export class WorkspaceContainer extends WorkspaceSplit implements IWorkspaceContainer {
    win: Window = window;
    doc: Document = document;
    containerEl: HTMLElement = document.createElement('div');

    constructor(parent: WorkspaceParent) {
        super(parent);
        this.type = 'container';
    }

    getContainer(): IWorkspaceContainer {
        return this;
    }
}

export class WorkspaceFloating extends WorkspaceSplit {
    constructor(parent: WorkspaceParent) {
        super(parent);
        this.type = 'floating';
    }
} 