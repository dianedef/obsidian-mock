import { vi, describe, it, expect, beforeEach } from 'vitest';
import { WorkspaceLeaf } from '../__mocks__/core/workspace-leaf';
import { Events } from '../components/events';
import type { WorkspaceParent, WorkspaceItem } from 'obsidian';

vi.mock('obsidian', () => ({
    Events: class {
        on = vi.fn();
        off = vi.fn();
        trigger = vi.fn();
    },
    View: class {
        constructor(leaf: any) {
            this.leaf = leaf;
            this.containerEl = document.createElement('div');
        }
        leaf: any;
        containerEl: HTMLElement;
        onload() {}
        onunload() {}
        protected async onOpen() {}
        protected async onClose() {}
    }
}));

// Mock complet du parent pour les tests
class MockParent extends Events implements WorkspaceParent {
    children: WorkspaceItem[] = [];
    parent: WorkspaceParent | null = null;

    getRoot(): WorkspaceParent {
        return this;
    }

    getContainer(): WorkspaceItem {
        return this;
    }

    app = {
        workspace: { activeLeaf: null }
    };
}

describe('WorkspaceLeaf', () => {
    let parent: MockParent;

    beforeEach(() => {
        parent = new MockParent();
    });

    it('devrait créer une instance avec les propriétés par défaut', () => {
        const leaf = new WorkspaceLeaf(parent);
        expect(leaf.containerEl).toBeDefined();
        expect(leaf.view).toBeDefined();
    });

    it('devrait gérer correctement l\'état isDeferred', () => {
        const leaf = new WorkspaceLeaf(parent);
        expect(leaf.isDeferred).toBe(false);
        leaf.loadIfDeferred();
        expect(leaf.isDeferred).toBe(false);
    });

    it('devrait gérer correctement le pinning', () => {
        const leaf = new WorkspaceLeaf(parent);
        expect(leaf.getViewState().pinned).toBe(false);
        leaf.setPinned(true);
        expect(leaf.getViewState().pinned).toBe(true);
        leaf.setPinned(false);
        expect(leaf.getViewState().pinned).toBe(false);
    });
}); 