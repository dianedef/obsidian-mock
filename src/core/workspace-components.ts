import { WorkspaceParent, WorkspaceContainer as IWorkspaceContainer, Events, WorkspaceItem as IWorkspaceItem, EventRef } from 'obsidian';

export class WorkspaceItem extends Events implements IWorkspaceItem {
    parent: WorkspaceParent;
    containerEl: HTMLElement;

    constructor(parent: WorkspaceParent) {
        super();
        this.parent = parent;
        this.containerEl = document.createElement('div');
    }

    getRoot(): WorkspaceParent {
        let item: WorkspaceParent = this;
        while (item.parent) {
            item = item.parent;
        }
        return item;
    }

    getContainer(): IWorkspaceContainer {
        return this.parent.getContainer();
    }

    on(name: string, callback: (...data: any[]) => any, ctx?: any): EventRef {
        super.on(name, callback, ctx);
        return { id: Math.random().toString() } as EventRef;
    }

    offref(ref: EventRef): void {
        super.offref(ref);
    }

    off(name: string, callback: (...data: any[]) => any): void {
        super.off(name, callback);
    }

    trigger(name: string, ...data: any[]): void {
        super.trigger(name, ...data);
    }
}

export class WorkspaceContainer extends WorkspaceItem implements IWorkspaceContainer {
    children: WorkspaceItem[] = [];
    win: Window = window;
    doc: Document = document;

    constructor(parent: WorkspaceParent) {
        super(parent);
        this.containerEl.addClass('workspace-container');
    }

    getContainer(): IWorkspaceContainer {
        return this;
    }

    addChild(child: WorkspaceItem, index?: number): void {
        if (typeof index === 'number' && index >= 0) {
            this.children.splice(index, 0, child);
        } else {
            this.children.push(child);
        }
        child.parent = this;
        this.containerEl.appendChild(child.containerEl);
    }

    removeChild(child: WorkspaceItem): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            child.containerEl.detach();
            child.parent = null as any;
        }
    }

    setChildren(children: WorkspaceItem[]): void {
        // Remove old children
        for (const child of this.children) {
            child.containerEl.detach();
            child.parent = null as any;
        }

        // Add new children
        this.children = children;
        for (const child of children) {
            child.parent = this;
            this.containerEl.appendChild(child.containerEl);
        }
    }

    empty(): void {
        this.setChildren([]);
    }
} 
