import { vi } from 'vitest';
import { WorkspaceTabs as IWorkspaceTabs, WorkspaceLeaf, WorkspaceContainer, WorkspaceParent } from 'obsidian';
import { Events } from '../components/events';

export class WorkspaceTabs extends Events implements IWorkspaceTabs {
    containerEl: HTMLElement = document.createElement('div');
    children: WorkspaceLeaf[] = [];
    type: 'tabs' = 'tabs';
    parent: WorkspaceParent | null = null;
    currentTab: number = 0;

    constructor() {
        super();
        this.containerEl.addClass('workspace-tabs');
    }

    addLeaf(leaf: WorkspaceLeaf, index?: number): void {
        if (typeof index === 'number') {
            this.children.splice(index, 0, leaf);
        } else {
            this.children.push(leaf);
        }
        this.trigger('leaf-added', leaf);
    }

    removeLeaf(leaf: WorkspaceLeaf): void {
        const index = this.children.indexOf(leaf);
        if (index > -1) {
            this.children.splice(index, 1);
            this.trigger('leaf-removed', leaf);
        }
    }

    getContainer(): WorkspaceContainer {
        return this.parent?.getContainer() as WorkspaceContainer;
    }

    getRoot(): WorkspaceParent {
        return this.parent?.getRoot() as WorkspaceParent;
    }
} 