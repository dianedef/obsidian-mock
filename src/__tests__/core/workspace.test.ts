import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../__mocks__/core/app';
import { Workspace } from '../../core/workspace';
import { WorkspaceContainer } from '../../core/workspace-components';
import type { TFile } from 'obsidian';
import { View } from '../../__mocks__/setup';

describe('Workspace', () => {
    let app: App;
    let workspace: Workspace;

    beforeEach(() => {
        app = new App();
        workspace = new Workspace(app);
    });

    it('should initialize with default properties', () => {
        expect(workspace.activeLeaf).toBeNull();
        expect(workspace.rootSplit).toBeDefined();
        expect(workspace.leftSplit).toBeDefined();
        expect(workspace.rightSplit).toBeDefined();
    });

    it('should get active view of type', () => {
        class TestView extends View {
            getViewType(): string {
                return 'test';
            }

            getDisplayText(): string {
                return 'Test View';
            }
        }
        const view = workspace.getActiveViewOfType(TestView);
        expect(view).toBeNull();
    });

    it('should get active file', () => {
        const file = workspace.getActiveFile();
        expect(file).toBeNull();
    });

    it('should get most recent leaf', () => {
        const leaf = workspace.getLastActiveLeaf();
        expect(leaf).toBeNull();
    });

    it('should get leaves of type', () => {
        const leaves = workspace.getLeavesOfType('markdown');
        expect(leaves).toEqual([]);
    });

    it('should handle layout operations', async () => {
        const layout = workspace.getLayout();
        expect(layout).toBeDefined();
        await workspace.loadLayout(layout);
    });

    describe('Leaf Management', () => {
        it('should create and manage leaves', () => {
            const leaf = workspace.getLeaf();
            expect(leaf).toBeDefined();

            workspace.setActiveLeaf(leaf);
            expect(workspace.activeLeaf).toBe(leaf);
        });

        it('should create leaves in a parent', () => {
            const parent = workspace.rootSplit;
            const leaf = workspace.createLeafInParent(parent, 0);
            expect(leaf).toBeDefined();
        });
    });

    describe('Leaf Type Management', () => {
        it('should get leaves by type', () => {
            const leaves = workspace.getLeavesOfType('markdown');
            expect(Array.isArray(leaves)).toBe(true);
        });

        it('should iterate over leaves', () => {
            let called = false;
            workspace.iterateLeaves(() => {
                called = true;
            });
            expect(called).toBe(false); // No leaves initially
        });
    });

    describe('View Management', () => {
        it('should get active view by type', () => {
            class TestView extends View {
                getViewType(): string {
                    return 'test';
                }

                getDisplayText(): string {
                    return 'Test View';
                }
            }
            const view = workspace.getActiveViewOfType(TestView);
            expect(view).toBeNull();
        });

        it('should get last active leaf', () => {
            const leaf = workspace.getLastActiveLeaf();
            expect(leaf).toBeNull();
        });
    });

    describe('Event Management', () => {
        it('should handle active leaf change events', () => {
            let called = false;
            const leaf = workspace.getLeaf();
            workspace.on('active-leaf-change', () => {
                called = true;
            });
            workspace.setActiveLeaf(leaf);
            expect(called).toBe(true);
        });

        it('should handle file open events', () => {
            let called = false;
            const file = {} as TFile;
            workspace.on('file-open', () => {
                called = true;
            });
            workspace.trigger('file-open', file);
            expect(called).toBe(true);
        });
    });

    describe('Layout Management', () => {
        it('should handle layout operations', async () => {
            await expect(workspace.saveLayout()).resolves.toBeUndefined();
            await expect(workspace.loadLayout({})).resolves.toBeUndefined();
        });
    });

    describe('Split Management', () => {
        it('should create splits correctly', () => {
            const leaf = workspace.getLeaf();
            workspace.setActiveLeaf(leaf);
            
            const newLeaf = workspace.createLeafBySplit(leaf, 'vertical');
            expect(newLeaf).toBeDefined();
        });

        it('should handle nested splits', () => {
            const rootLeaf = workspace.getLeaf();
            workspace.setActiveLeaf(rootLeaf);
            
            const newLeaf = workspace.createLeafBySplit(rootLeaf, 'horizontal');
            expect(newLeaf).toBeDefined();
        });
    });
}); 
