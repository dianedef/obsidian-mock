import { Events } from '../components/events';
import { WorkspaceItem, WorkspaceContainer } from 'obsidian';

export abstract class WorkspaceItemBase extends Events implements WorkspaceItem {
    abstract type: string;
    abstract containerEl: HTMLElement;
    abstract parent: WorkspaceItem;
    abstract children: WorkspaceItem[];

    abstract getRoot(): WorkspaceItem;
    abstract getContainer(): WorkspaceContainer;

    addChild(child: WorkspaceItem, index?: number): void {
        if (Array.isArray(this.children)) {
            if (typeof index === 'number') {
                this.children.splice(index, 0, child);
            } else {
                this.children.push(child);
            }
        }
    }

    removeChild(child: WorkspaceItem): void {
        if (Array.isArray(this.children)) {
            const index = this.children.indexOf(child);
            if (index > -1) {
                this.children.splice(index, 1);
            }
        }
    }
} 