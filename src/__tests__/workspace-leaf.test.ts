import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WorkspaceLeaf } from '../__mocks__/core/workspace-leaf';
import { Events } from '../__mocks__/components/events';
import type { WorkspaceParent, WorkspaceItem, WorkspaceContainer } from 'obsidian';

// Test implementation of the parent
class TestParent extends Events implements WorkspaceParent {
    children: WorkspaceItem[] = [];
    containerEl = document.createElement('div');
    win = window;
    doc = document;
    parent: WorkspaceParent | null = null;
    collapsed = false;

    getRoot(): WorkspaceItem {
        return this;
    }

    getContainer(): WorkspaceContainer {
        return this;
    }

    addChild(child: WorkspaceItem) {
        this.children.push(child);
    }

    removeChild(child: WorkspaceItem) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    expand() {
        this.collapsed = false;
    }

    collapse() {
        this.collapsed = true;
    }

    toggle() {
        this.collapsed = !this.collapsed;
    }

    offref() {}
}

describe('WorkspaceLeaf', () => {
    let parent: TestParent;
    let leaf: WorkspaceLeaf;

    beforeEach(() => {
        parent = new TestParent();
        leaf = new WorkspaceLeaf(parent);
    });

    it('should create an instance with default properties', () => {
        expect(leaf.containerEl).toBeDefined();
        expect(leaf.view).toBeDefined();
    });

    it('should correctly handle the isDeferred state', () => {
        expect(leaf.isDeferred).toBe(false);
        leaf.loadIfDeferred();
        expect(leaf.isDeferred).toBe(false);
    });

    it('should correctly handle pinning', () => {
        expect(leaf.getViewState().pinned).toBe(false);
        leaf.setPinned(true);
        expect(leaf.getViewState().pinned).toBe(true);
        leaf.setPinned(false);
        expect(leaf.getViewState().pinned).toBe(false);
    });
}); 