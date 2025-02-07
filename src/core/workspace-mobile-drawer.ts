import { App, WorkspaceMobileDrawer as IWorkspaceMobileDrawer, WorkspaceItem, WorkspaceContainer } from 'obsidian';
import { WorkspaceItemBase } from './workspace-item-base';

export class WorkspaceMobileDrawer extends WorkspaceItemBase implements IWorkspaceMobileDrawer {
    type = 'mobile-drawer';
    containerEl: HTMLElement;
    children: WorkspaceItem[] = [];
    private _parent: WorkspaceItem;

    constructor(rootSplit: WorkspaceItem, app: App) {
        super();
        this._parent = rootSplit;
        this.containerEl = document.createElement('div');
        this.containerEl.addClass('workspace-drawer');
    }

    get parent(): WorkspaceItem {
        return this._parent;
    }

    set parent(value: WorkspaceItem) {
        this._parent = value;
    }

    getRoot(): WorkspaceItem {
        return this.parent?.getRoot() || this;
    }

    getContainer(): WorkspaceContainer {
        return this.parent?.getContainer() || null;
    }

    collapse(): void {
        if (!this.collapsed) {
            this.collapsed = true;
            this.containerEl.addClass('is-collapsed');
        }
    }

    expand(): void {
        if (this.collapsed) {
            this.collapsed = false;
            this.containerEl.removeClass('is-collapsed');
        }
    }

    toggle(): void {
        if (this.collapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    addChild(child: WorkspaceItem, index?: number): void {
        if (typeof index === 'number') {
            this.children.splice(index, 0, child);
        } else {
            this.children.push(child);
        }
    }

    removeChild(child: WorkspaceItem): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    get collapsed(): boolean {
        return this.containerEl.hasClass('is-collapsed');
    }

    set collapsed(value: boolean) {
        if (value) {
            this.containerEl.addClass('is-collapsed');
        } else {
            this.containerEl.removeClass('is-collapsed');
        }
    }
} 