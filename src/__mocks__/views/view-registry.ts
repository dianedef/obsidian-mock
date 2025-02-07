import { vi } from 'vitest';
import type { View, ViewCreator, WorkspaceLeaf } from 'obsidian';

export class ViewRegistry {
    private viewCreators: Map<string, ViewCreator> = new Map();

    registerView(type: string, viewCreator: ViewCreator): void {
        this.viewCreators.set(type, viewCreator);
    }

    getViewCreator(type: string): ViewCreator | null {
        return this.viewCreators.get(type) || null;
    }

    isExtensionRegistered(type: string): boolean {
        return this.viewCreators.has(type);
    }

    unregisterView(type: string): void {
        this.viewCreators.delete(type);
    }

    getRegisteredViews(): string[] {
        return Array.from(this.viewCreators.keys());
    }

    createView = vi.fn().mockImplementation((leaf: WorkspaceLeaf): View | null => {
        const type = leaf.getViewState().type;
        const creator = this.getViewCreator(type);
        if (creator) {
            return creator(leaf);
        }
        return null;
    });
} 