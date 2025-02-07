import { WorkspaceItem, WorkspaceParent, App, WorkspaceContainer } from 'obsidian';
import { Events } from '../components/events';

interface HasContainerEl {
    containerEl: HTMLElement;
}

function hasContainerEl(item: any): item is HasContainerEl {
    return item && typeof item === 'object' && 'containerEl' in item && item.containerEl instanceof HTMLElement;
}

export class WorkspaceSplit extends WorkspaceParent {
    containerEl: HTMLElement;
    children: WorkspaceItem[] = [];
    direction: 'horizontal' | 'vertical';
    parent: WorkspaceParent;

    constructor(parent: WorkspaceParent | null) {
        super();
        this.parent = parent || this;
        this.containerEl = document.createElement('div');
        this.containerEl.addClass('workspace-split');
        this.direction = 'vertical';
    }

    getRoot(): WorkspaceItem {
        return this.parent?.getRoot() || this;
    }

    getContainer(): WorkspaceContainer {
        return this.parent?.getContainer();
    }

    addChild(child: WorkspaceItem, index?: number): void {
        if (index === undefined) {
            this.children.push(child);
        } else {
            this.children.splice(index, 0, child);
        }
        if (hasContainerEl(child)) {
            this.containerEl.appendChild(child.containerEl);
        }
    }

    insertChild(index: number, child: WorkspaceItem): void {
        this.addChild(child, index);
    }

    removeChild(child: WorkspaceItem): void {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            if (hasContainerEl(child)) {
                child.containerEl.detach();
            }
        }
    }

    replaceChild(oldChild: WorkspaceItem, newChild: WorkspaceItem): void {
        const index = this.children.indexOf(oldChild);
        if (index > -1) {
            this.children[index] = newChild;
            if (hasContainerEl(oldChild)) {
                oldChild.containerEl.detach();
            }
            if (hasContainerEl(newChild)) {
                this.containerEl.appendChild(newChild.containerEl);
            }
        }
    }

    setDirection(direction: 'horizontal' | 'vertical'): void {
        this.direction = direction;
        this.containerEl.removeClass('workspace-split-horizontal');
        this.containerEl.removeClass('workspace-split-vertical');
        this.containerEl.addClass(`workspace-split-${direction}`);
    }
} 
