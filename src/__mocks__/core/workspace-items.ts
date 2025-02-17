import { vi } from 'vitest';
import { Events } from '../components/events';
import type { 
    WorkspaceItem as IWorkspaceItem,
    WorkspaceContainer as IWorkspaceContainer,
    WorkspaceTabs as IWorkspaceTabs,
    WorkspaceMobileDrawer,
    WorkspaceParent,
    WorkspaceSplit as IWorkspaceSplit,
    App,
    WorkspaceLeaf
} from 'obsidian';

export abstract class WorkspaceItem extends Events implements IWorkspaceItem {
    app: App;
    parent: WorkspaceParent | null;

    constructor(app: App, parent: WorkspaceParent | null) {
        super();
        this.app = app;
        this.parent = parent;
    }

    getRoot(): WorkspaceContainer {
        let root: WorkspaceParent = this;
        while (root.parent) {
            root = root.parent;
        }
        return root as WorkspaceContainer;
    }

    getContainer(): WorkspaceContainer {
        return this.getRoot();
    }

    protected setParent(parent: WorkspaceParent | null): void {
        this.parent = parent;
    }
}

export class WorkspaceContainer extends WorkspaceItem implements IWorkspaceContainer {
    type: string = 'container';
    win: Window = window;
    doc: Document = document;
    containerEl: HTMLElement = document.createElement('div');

    constructor(parent: WorkspaceParent, app: App) {
        super(parent, app);
    }
}

export class WorkspaceTabs extends WorkspaceItem implements IWorkspaceTabs {
    children: WorkspaceLeaf[] = [];
    type: string = 'tabs';
    currentTab: number = 0;

    constructor(parent: WorkspaceParent, app: App) {
        super(parent, app);
        this.containerEl.addClass('workspace-tabs');
    }

    addChild(child: WorkspaceLeaf, index?: number): void {
        if (typeof index === 'number') {
            this.children.splice(index, 0, child);
        } else {
            this.children.push(child);
        }
        this.currentTab = this.children.length - 1;
    }

    removeChild(child: WorkspaceLeaf): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            if (this.currentTab >= this.children.length) {
                this.currentTab = Math.max(0, this.children.length - 1);
            }
        }
    }

    setActiveLeaf(leaf: WorkspaceLeaf): void {
        const index = this.children.indexOf(leaf);
        if (index > -1) {
            this.currentTab = index;
        }
    }
}

export class WorkspaceSplit extends WorkspaceItem implements IWorkspaceSplit {
    children: IWorkspaceItem[] = [];
    type: string = 'split';

    constructor(app: App, parent: WorkspaceParent) {
        super(parent, app);
    }

    addChild(child: IWorkspaceItem, index?: number): void {
        if (index !== undefined) {
            this.children.splice(index, 0, child);
        } else {
            this.children.push(child);
        }
        (child as WorkspaceItem).parent = this;
    }

    removeChild(child: IWorkspaceItem): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            (child as WorkspaceItem).parent = this.getRoot();
        }
    }
}

export class WorkspaceFloating extends WorkspaceSplit {
    constructor(app: App, parent: WorkspaceParent) {
        super(app, parent);
    }
} 