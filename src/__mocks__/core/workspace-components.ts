import { vi } from 'vitest';
import type { 
    App,
    Events as IEvents,
    WorkspaceContainer,
    WorkspaceSplit as IWorkspaceSplit,
    WorkspaceSidedock as IWorkspaceSidedock,
    WorkspaceTabs as IWorkspaceTabs,
    WorkspaceRoot as IWorkspaceRoot,
    WorkspaceWindow,
    WorkspaceLeaf,
    WorkspaceMobileDrawer as IWorkspaceMobileDrawer,
    View,
    ViewState,
    WorkspaceParent,
    SplitDirection
} from 'obsidian';
import { Events } from '../components/events';
import { WorkspaceItem } from './workspace-items';
import { WorkspaceLeaf as WorkspaceLeafImpl } from './workspace-leaf';
import { WorkspaceContainer as WorkspaceContainerImpl } from './workspace-container';

export class WorkspaceRoot extends WorkspaceContainerImpl implements IWorkspaceRoot {
    children: WorkspaceLeaf[] = [];
    activeLeaf: WorkspaceLeaf | null = null;

    constructor(app: App) {
        super(app);
    }

    addChild(child: WorkspaceLeaf, index?: number): void {
        if (index !== undefined) {
            this.children.splice(index, 0, child);
        } else {
            this.children.push(child);
        }
        (child as any).parent = this;
    }

    removeChild(child: WorkspaceLeaf): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            (child as any).parent = null;
        }
    }

    setActiveLeaf(leaf: WorkspaceLeaf | null): void {
        this.activeLeaf = leaf;
    }

    getActiveLeaf(): WorkspaceLeaf | null {
        return this.activeLeaf;
    }

    createLeaf(): WorkspaceLeaf {
        const leaf = new WorkspaceLeafImpl(this.app, this);
        this.addChild(leaf);
        return leaf;
    }
}

export class WorkspaceSidedock extends WorkspaceItem implements IWorkspaceSidedock {
    children: WorkspaceLeaf[] = [];
    collapsed: boolean = false;
    side: 'left' | 'right';

    constructor(parent: WorkspaceParent, app: App, side: 'left' | 'right') {
        super(app, parent);
        this.side = side;
    }

    getRoot(): WorkspaceContainer {
        return this.parent.getRoot();
    }

    getContainer(): WorkspaceContainer {
        return this.parent.getContainer();
    }

    addChild(child: WorkspaceLeaf): void {
        this.children.push(child);
        (child as any).parent = this;
    }

    removeChild(child: WorkspaceLeaf): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            (child as any).parent = null;
        }
    }

    expand(): void {
        this.collapsed = false;
        this.trigger('expand');
    }

    collapse(): void {
        this.collapsed = true;
        this.trigger('collapse');
    }

    toggle(): void {
        if (this.collapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }
}

export class WorkspaceMobileDrawer extends WorkspaceItem implements IWorkspaceMobileDrawer {
    children: WorkspaceLeaf[] = [];
    collapsed: boolean = false;

    constructor(parent: WorkspaceParent, app: App) {
        super(app, parent);
    }

    getRoot(): WorkspaceContainer {
        return this.parent.getRoot();
    }

    getContainer(): WorkspaceContainer {
        return this.parent.getContainer();
    }

    addChild(child: WorkspaceLeaf): void {
        this.children.push(child);
        (child as any).parent = this;
    }

    removeChild(child: WorkspaceLeaf): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            (child as any).parent = null;
        }
    }

    expand(): void {
        this.collapsed = false;
        this.trigger('expand');
    }

    collapse(): void {
        this.collapsed = true;
        this.trigger('collapse');
    }

    toggle(): void {
        if (this.collapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }
}

export class WorkspaceSplit extends WorkspaceItem implements IWorkspaceSplit {
    children: WorkspaceItem[] = [];

    constructor(parent: WorkspaceParent | null, app: App) {
        super(app, parent);
    }

    addLeaf(item: WorkspaceLeaf, index?: number): void {
        const workspaceItem = item as unknown as WorkspaceItem;
        if (index !== undefined) {
            this.children.splice(index, 0, workspaceItem);
        } else {
            this.children.push(workspaceItem);
        }
        (item as any).parent = this;
    }

    removeChild(child: WorkspaceItem, index?: number): void {
        if (index !== undefined) {
            this.children.splice(index, 1);
        } else {
            const idx = this.children.indexOf(child);
            if (idx > -1) {
                this.children.splice(idx, 1);
            }
        }
        (child as any).parent = null;
    }

    insertChild(item: WorkspaceItem, index: number): void {
        this.children.splice(index, 0, item);
        (item as any).parent = this;
    }

    replaceChild(oldChild: WorkspaceItem, newChild: WorkspaceItem): void {
        const index = this.children.indexOf(oldChild);
        if (index > -1) {
            this.children[index] = newChild;
            (oldChild as any).parent = null;
            (newChild as any).parent = this;
        }
    }

    getLeaf(): WorkspaceLeaf {
        return new WorkspaceLeafImpl(this.app, this);
    }

    findLeaf(callback: (leaf: WorkspaceLeaf) => boolean): WorkspaceLeaf | null {
        for (const child of this.children) {
            if ('view' in child) {
                const leaf = child as unknown as WorkspaceLeaf;
                if (callback(leaf)) {
                    return leaf;
                }
            }
        }
        return null;
    }

    removeLeaf(leaf: WorkspaceLeaf): void {
        this.removeChild(leaf as unknown as WorkspaceItem);
        this.trigger('leaf-deleted', leaf);
    }
}

export class WorkspaceTabs extends WorkspaceItem implements IWorkspaceTabs {
    children: WorkspaceLeaf[] = [];

    constructor(parent: WorkspaceParent | null, app: App) {
        super(app, parent);
    }

    addChild(child: WorkspaceLeaf, index?: number): void {
        if (index !== undefined) {
            this.children.splice(index, 0, child);
        } else {
            this.children.push(child);
        }
        (child as any).parent = this;
    }

    removeChild(child: WorkspaceLeaf): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            (child as any).parent = null;
        }
    }
} 