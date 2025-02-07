import type { WorkspaceItem } from 'obsidian';

export interface WorkspaceParent {
    children: WorkspaceItem[];
    addChild(child: WorkspaceItem, index?: number): void;
    removeChild(child: WorkspaceItem): void;
    replaceChild(oldChild: WorkspaceItem, newChild: WorkspaceItem): void;
    insertBefore(child: WorkspaceItem, referenceChild: WorkspaceItem): void;
    insertAfter(child: WorkspaceItem, referenceChild: WorkspaceItem): void;
} 