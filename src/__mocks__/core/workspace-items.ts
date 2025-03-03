import { vi } from 'vitest';
import { Events } from '../components/events';
import type { 
    WorkspaceItem as IWorkspaceItem,
    WorkspaceContainer as IWorkspaceContainer,
    WorkspaceTabs as IWorkspaceTabs,
    WorkspaceMobileDrawer,
    WorkspaceParent as IWorkspaceParent,
    WorkspaceSplit as IWorkspaceSplit,
    App,
    WorkspaceLeaf
} from 'obsidian';

export abstract class WorkspaceItem extends Events implements IWorkspaceItem {
    abstract parent: IWorkspaceParent;
    containerEl: HTMLElement = document.createElement('div');
    type: string = 'item';
    app: App;
    win: Window = window;
    doc: Document = document;

    constructor(app: App) {
        super();
        this.app = app;
    }

    abstract getRoot(): IWorkspaceContainer;
    abstract getContainer(): IWorkspaceContainer;
}

export abstract class WorkspaceParent extends WorkspaceItem implements IWorkspaceParent {
    children: (WorkspaceLeaf | IWorkspaceItem)[] = [];

    addChild(child: WorkspaceLeaf | IWorkspaceItem, index?: number): void {
        if (index !== undefined) {
            this.children.splice(index, 0, child);
        } else {
            this.children.push(child);
        }
        (child as any).parent = this;
    }

    removeChild(child: WorkspaceLeaf | IWorkspaceItem): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            (child as any).parent = null;
        }
    }
}

export class WorkspaceSplit extends WorkspaceParent implements IWorkspaceSplit {
    parent: IWorkspaceParent;
    type: string = 'split';

    constructor(parent: IWorkspaceParent, app: App) {
        super(app);
        this.parent = parent;
    }

    getRoot(): IWorkspaceContainer {
        let root: IWorkspaceParent = this;
        while (root.parent) {
            root = root.parent;
        }
        return root as IWorkspaceContainer;
    }

    getContainer(): IWorkspaceContainer {
        return this.getRoot();
    }
}

export class WorkspaceContainer extends WorkspaceSplit {
    win: Window = window;
    doc: Document = document;

    constructor(parent: IWorkspaceParent, app: App) {
        super(parent, app);
    }

    getRoot(): IWorkspaceContainer {
        return this;
    }

    getContainer(): IWorkspaceContainer {
        return this;
    }
}

export class WorkspaceTabs extends WorkspaceParent implements IWorkspaceTabs {
    parent: IWorkspaceParent;
    children: WorkspaceLeaf[] = [];
    type: string = 'tabs';
    currentTab: number = 0;

    constructor(parent: IWorkspaceParent, app: App) {
        super(app);
        this.parent = parent;
        this.containerEl.addClass('workspace-tabs');
    }

    getRoot(): IWorkspaceContainer {
        return this.parent.getRoot();
    }

    getContainer(): IWorkspaceContainer {
        return this.parent.getContainer();
    }

    setActiveLeaf(leaf: WorkspaceLeaf): void {
        const index = this.children.indexOf(leaf);
        if (index > -1) {
            this.currentTab = index;
        }
    }
}

export class WorkspaceFloating extends WorkspaceSplit {
    constructor(parent: IWorkspaceParent, app: App) {
        super(parent, app);
    }
} 