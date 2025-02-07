import { describe, it, expect, beforeEach } from 'vitest';
import { MarkdownView } from '../../__mocks__/views/markdown-view';
import { WorkspaceLeaf } from '../../__mocks__/views/workspace-leaf';
import { App } from '../../__mocks__/core/app';
describe('MarkdownView', () => {
    let app;
    let leaf;
    let view;
    let parent;
    let mockFile;
    beforeEach(() => {
        app = new App();
        parent = {
            children: [],
            getRoot: () => parent,
            getContainer: () => parent,
            win: window,
            doc: document,
            containerEl: document.createElement('div')
        };
        leaf = new WorkspaceLeaf(app, parent);
        view = new MarkdownView(leaf);
        mockFile = {
            path: 'test.md',
            basename: 'test',
            extension: 'md',
            vault: app.vault,
            parent: null,
            name: 'test.md'
        };
    });
    describe('Constructeur', () => {
        it('devrait initialiser correctement les propriétés de base', () => {
            expect(view.app).toBe(app);
            expect(view.leaf).toBe(leaf);
            expect(view.containerEl).toBeInstanceOf(HTMLElement);
            expect(view.editor).toBeDefined();
            expect(view.previewMode).toBeDefined();
            expect(view.file).toBeNull();
            expect(view.data).toBe('');
            expect(view.getViewType()).toBe('markdown');
        });
        it('devrait initialiser correctement l\'éditeur', () => {
            expect(view.editor.getValue()).toBe('');
            expect(view.editor.getCursor()).toEqual({ line: 0, ch: 0 });
            expect(view.editor.getScrollInfo()).toEqual({ top: 0, left: 0 });
        });
        it('devrait initialiser correctement le mode prévisualisation', () => {
            expect(view.previewMode.containerEl).toBeInstanceOf(HTMLElement);
            expect(view.previewMode).toBeDefined();
        });
    });
    describe('Gestion des modes', () => {
        it('devrait gérer correctement le changement de mode', () => {
            expect(view.getMode()).toBeDefined();
            view.setMode('preview');
            expect(view.getMode()).toBeDefined();
            view.setMode('source');
            expect(view.getMode()).toBeDefined();
        });
        it('devrait basculer correctement entre les modes', () => {
            view.showPreview();
            expect(view.setMode).toHaveBeenCalledWith('preview');
            view.showEdit();
            expect(view.setMode).toHaveBeenCalledWith('source');
            view.toggleSourceAndPreview();
            expect(view.setMode).toHaveBeenCalled();
        });
    });
    describe('Gestion du contenu', () => {
        it('devrait gérer correctement les données de la vue', () => {
            expect(view.getViewData()).toBe('');
            const data = 'Test content';
            view.setViewData(data);
            expect(view.setViewData).toHaveBeenCalledWith(data);
        });
        it('devrait gérer correctement le défilement', () => {
            expect(view.getScroll()).toEqual({ top: 0, left: 0 });
            view.applyScroll({ top: 100, left: 0 });
            expect(view.applyScroll).toHaveBeenCalledWith({ top: 100, left: 0 });
        });
    });
    describe('Méthodes de cycle de vie', () => {
        it('devrait gérer correctement le chargement et déchargement de fichier', async () => {
            await view.onLoadFile(mockFile);
            expect(view.file).toBe(mockFile);
            await view.onUnloadFile(mockFile);
            expect(view.file).toBeNull();
        });
        it('devrait gérer correctement le renommage de fichier', async () => {
            view.file = mockFile;
            await view.onRename(mockFile);
            expect(view.file).toBe(mockFile);
        });
        it('devrait gérer correctement l\'état de la vue', async () => {
            const state = { file: 'test.md' };
            await view.setState(state, { history: false });
            expect(view.file).toBeDefined();
        });
    });
    describe('Méthodes utilitaires', () => {
        it('devrait avoir une méthode clear fonctionnelle', () => {
            view.clear();
            expect(view.clear).toHaveBeenCalled();
        });
        it('devrait avoir une méthode onRename fonctionnelle', () => {
            view.onRename();
            expect(view.onRename).toHaveBeenCalled();
        });
        it('devrait avoir une méthode canAcceptExtension fonctionnelle', () => {
            expect(view.canAcceptExtension()).toBe(true);
            expect(view.canAcceptExtension).toHaveBeenCalled();
        });
        it('devrait avoir une méthode getContext fonctionnelle', () => {
            expect(view.getContext()).toEqual({});
            expect(view.getContext).toHaveBeenCalled();
        });
    });
    describe('Méthodes de l\'éditeur', () => {
        it('devrait avoir des méthodes d\'édition fonctionnelles', () => {
            expect(view.editor.getValue()).toBe('');
            expect(view.editor.getDoc().getValue()).toBe('');
            expect(view.editor.getSelection()).toBe('');
            expect(view.editor.getLine(0)).toBe('');
            expect(view.editor.somethingSelected()).toBe(false);
            expect(view.editor.hasFocus()).toBe(false);
        });
        it('devrait avoir des méthodes de manipulation du curseur fonctionnelles', () => {
            const pos = { line: 0, ch: 0 };
            view.editor.setCursor(pos);
            expect(view.editor.setCursor).toHaveBeenCalledWith(pos);
            expect(view.editor.getCursor()).toEqual(pos);
        });
        it('devrait avoir des méthodes de défilement fonctionnelles', () => {
            view.editor.scrollTo(0, 100);
            expect(view.editor.scrollTo).toHaveBeenCalledWith(0, 100);
            const range = { from: { line: 0, ch: 0 }, to: { line: 1, ch: 0 } };
            view.editor.scrollIntoView(range);
            expect(view.editor.scrollIntoView).toHaveBeenCalledWith(range);
        });
    });
});
