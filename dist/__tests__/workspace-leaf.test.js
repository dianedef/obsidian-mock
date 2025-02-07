import { vi, describe, it, expect, beforeEach } from 'vitest';
import { WorkspaceLeaf } from '../__mocks__/core/workspace-leaf';
import { Events } from '../components/events';
vi.mock('obsidian', () => ({
    Events: class {
        constructor() {
            this.on = vi.fn();
            this.off = vi.fn();
            this.trigger = vi.fn();
        }
    },
    View: class {
        constructor(leaf) {
            this.leaf = leaf;
            this.containerEl = document.createElement('div');
        }
        onload() { }
        onunload() { }
        async onOpen() { }
        async onClose() { }
    }
}));
// Mock complet du parent pour les tests
class MockParent extends Events {
    constructor() {
        super(...arguments);
        this.children = [];
        this.parent = null;
        this.app = {
            workspace: { activeLeaf: null }
        };
    }
    getRoot() {
        return this;
    }
    getContainer() {
        return this;
    }
}
describe('WorkspaceLeaf', () => {
    let parent;
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
