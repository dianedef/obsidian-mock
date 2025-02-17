import { vi } from 'vitest';
import { View } from './view';
import type { WorkspaceLeaf } from 'obsidian';

export class EmptyView extends View {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.getViewType = vi.fn().mockReturnValue('empty');
        this.getDisplayText = vi.fn().mockReturnValue('Empty');
    }
} 