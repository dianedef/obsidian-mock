import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../__mocks__/core/app';
import { FileExplorerView } from '../../__mocks__/views/file-explorer-view';
import { WorkspaceLeaf } from '../../__mocks__/views/workspace-leaf';
import { WorkspaceTabs } from '../../__mocks__/core/workspace-items';
describe('FileExplorerView', () => {
    let app;
    let testFile;
    let testFolder;
    let view;
    let parent;
    let leaf;
    beforeEach(() => {
        app = new App();
        parent = new WorkspaceTabs(null);
        leaf = new WorkspaceLeaf(app, parent);
        // Création d'un fichier de test
        testFile = {
            path: 'test.md',
            name: 'test.md',
            vault: app.vault,
            basename: 'test',
            extension: 'md',
            parent: null,
            stat: { ctime: Date.now(), mtime: Date.now(), size: 0 }
        };
        // Création d'un dossier de test
        testFolder = {
            path: 'test',
            name: 'test',
            vault: app.vault,
            children: [],
            parent: null,
            isRoot: () => false,
            stat: { ctime: Date.now(), mtime: Date.now(), size: 0 }
        };
        view = new FileExplorerView(leaf);
    });
    describe('Initialisation', () => {
        it('devrait avoir le bon type de vue', () => {
            expect(view.getViewType()).toBe('file-explorer');
        });
        it('devrait avoir le bon texte d\'affichage', () => {
            expect(view.getDisplayText()).toBe('Explorateur de fichiers');
        });
        it('devrait initialiser une interface utilisateur de base', () => {
            expect(view.containerEl.classList.contains('file-explorer-view')).toBe(true);
            expect(view.containerEl.querySelector('.file-explorer-toolbar')).toBeDefined();
            expect(view.containerEl.querySelector('.file-explorer-files')).toBeDefined();
        });
    });
    describe('Gestion des fichiers', () => {
        it('devrait permettre d\'ajouter des fichiers', () => {
            view.addFile(testFile);
            expect(view.getAllFiles()).toContain(testFile);
        });
        it('devrait permettre de supprimer des fichiers', () => {
            view.addFile(testFile);
            view.removeFile(testFile);
            expect(view.getAllFiles()).not.toContain(testFile);
        });
        it('devrait permettre de sélectionner un fichier', () => {
            view.addFile(testFile);
            view.selectFile(testFile);
            expect(view.getSelectedFile()).toBe(testFile);
        });
        it('devrait désélectionner le fichier lors de sa suppression', () => {
            view.addFile(testFile);
            view.selectFile(testFile);
            view.removeFile(testFile);
            expect(view.getSelectedFile()).toBeNull();
        });
    });
    describe('Navigation', () => {
        it('devrait révéler un fichier', () => {
            view.addFile(testFile);
            view.revealFile(testFile);
            expect(view.getSelectedFile()).toBe(testFile);
        });
    });
    describe('Recherche', () => {
        beforeEach(() => {
            view.addFile(testFile);
            view.addFile(testFolder);
        });
        it('devrait trouver des fichiers par nom', () => {
            const results = view.search('test');
            expect(results).toContain(testFile);
            expect(results).toContain(testFolder);
        });
        it('devrait être insensible à la casse', () => {
            const results = view.search('TEST');
            expect(results).toContain(testFile);
            expect(results).toContain(testFolder);
        });
        it('devrait retourner un tableau vide si aucun résultat', () => {
            const results = view.search('nonexistent');
            expect(results).toHaveLength(0);
        });
    });
    describe('Interface utilisateur', () => {
        it('devrait créer des éléments DOM pour les fichiers', () => {
            view.addFile(testFile);
            const fileEl = view.containerEl.querySelector('.file-explorer-file');
            expect(fileEl).toBeDefined();
            expect(fileEl?.textContent).toBe(testFile.name);
        });
        it('devrait créer des éléments DOM pour les dossiers', () => {
            view.addFile(testFolder);
            const folderEl = view.containerEl.querySelector('.file-explorer-folder');
            expect(folderEl).toBeDefined();
            expect(folderEl?.textContent).toBe(testFolder.name);
        });
        it('devrait marquer les fichiers sélectionnés', () => {
            view.addFile(testFile);
            view.selectFile(testFile);
            const selectedEl = view.containerEl.querySelector('.is-selected');
            expect(selectedEl).toBeDefined();
            expect(selectedEl?.textContent).toBe(testFile.name);
        });
    });
});
