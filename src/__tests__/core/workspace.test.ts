import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../__mocks__/core/app';
import { Workspace } from '../../__mocks__/core/workspace';
import { WorkspaceContainer } from '../../__mocks__/core/workspace-container';
import type { TFile } from 'obsidian';
import { View } from '../../__mocks__/views/view';

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
        }
        const leaf = workspace.getLeaf();
        const testView = new TestView(leaf);
        leaf.view = testView;
        workspace.setActiveLeaf(leaf);
        
        const view = workspace.getActiveViewOfType(TestView);
        expect(view).toBeInstanceOf(TestView);
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
        class TestView extends View {
            getViewType(): string {
                return 'test';
            }
        }

        it('should get active view by type', () => {
            const leaf = workspace.getLeaf();
            const testView = new TestView(leaf);
            leaf.view = testView;
            workspace.setActiveLeaf(leaf);
            
            const view = workspace.getActiveViewOfType(TestView);
            expect(view).toBeInstanceOf(TestView);
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

    describe('Gestion avancée des vues', () => {
        it('devrait gérer correctement les vues détachées', () => {
            const leaf = workspace.getLeaf(true); // créer une vue détachée
            expect(leaf.getRoot()).not.toBe(workspace.rootSplit);
        });

        it('devrait pouvoir basculer entre les vues', () => {
            const leaf1 = workspace.getLeaf();
            const leaf2 = workspace.createLeafBySplit(leaf1);
            
            workspace.setActiveLeaf(leaf1);
            expect(workspace.activeLeaf).toBe(leaf1);
            
            workspace.setActiveLeaf(leaf2);
            expect(workspace.activeLeaf).toBe(leaf2);
        });

        it('devrait maintenir l\'historique des vues actives', () => {
            const leaf1 = workspace.getLeaf();
            const leaf2 = workspace.createLeafBySplit(leaf1);
            const leaf3 = workspace.createLeafBySplit(leaf2);

            workspace.setActiveLeaf(leaf1);
            workspace.setActiveLeaf(leaf2);
            workspace.setActiveLeaf(leaf3);

            const lastActive = workspace.getLastActiveLeaf();
            expect(lastActive).toBe(leaf3);
        });
    });

    describe('Gestion des états de l\'espace de travail', () => {
        it('devrait pouvoir sauvegarder et restaurer l\'état', async () => {
            const leaf1 = workspace.getLeaf();
            const leaf2 = workspace.createLeafBySplit(leaf1);
            workspace.setActiveLeaf(leaf2);

            const state = workspace.getLayout();
            await workspace.loadLayout(state);

            expect(workspace.getLeavesOfType('markdown').length).toBe(0);
        });

        it('devrait gérer les changements de mode', () => {
            expect(workspace.containerEl).toBeInstanceOf(HTMLElement);
            
            // Simuler un changement de mode
            workspace.trigger('workspace-mode-change', 'source');
            expect(workspace.containerEl.classList.contains('is-source-mode')).toBe(true);
            
            workspace.trigger('workspace-mode-change', 'preview');
            expect(workspace.containerEl.classList.contains('is-preview-mode')).toBe(true);
        });
    });

    describe('Gestion des événements avancés', () => {
        it('devrait émettre des événements lors de la création de feuilles', () => {
            let called = false;
            workspace.on('leaf-created', () => {
                called = true;
            });

            workspace.getLeaf();
            expect(called).toBe(true);
        });

        it('devrait émettre des événements lors de la suppression de feuilles', () => {
            let called = false;
            const leaf = workspace.getLeaf();
            
            workspace.on('leaf-deleted', () => {
                called = true;
            });

            workspace.rootSplit.addLeaf(leaf);
            leaf.detach();
            expect(called).toBe(true);
        });

        it('devrait émettre des événements lors des changements de disposition', () => {
            let called = false;
            workspace.on('layout-change', () => {
                called = true;
            });

            const leaf = workspace.getLeaf();
            workspace.createLeafBySplit(leaf);
            expect(called).toBe(true);
        });
    });
}); 
