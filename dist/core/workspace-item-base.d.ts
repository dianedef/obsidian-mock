import { Events } from '../components/events';
import { WorkspaceItem, WorkspaceContainer } from 'obsidian';
export declare abstract class WorkspaceItemBase extends Events implements WorkspaceItem {
    abstract type: string;
    abstract containerEl: HTMLElement;
    abstract parent: WorkspaceItem;
    abstract children: WorkspaceItem[];
    abstract getRoot(): WorkspaceItem;
    abstract getContainer(): WorkspaceContainer;
    addChild(child: WorkspaceItem, index?: number): void;
    removeChild(child: WorkspaceItem): void;
}
