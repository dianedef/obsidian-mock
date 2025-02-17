import { describe, it, expect, beforeEach } from 'vitest';
import { MarkdownView } from '../../__mocks__/views/markdown-view';
import { App } from '../../__mocks__/core/app';
import { WorkspaceLeaf } from '../../__mocks__/core/workspace-leaf';
import { WorkspaceTabs } from '../../__mocks__/core/workspace-items';
import type { TFile } from 'obsidian';

describe('MarkdownView', () => {
    let app: App;
    let leaf: WorkspaceLeaf;
    let view: MarkdownView;
    let parent: WorkspaceTabs;
    let mockFile: TFile;

    beforeEach(() => {
        app = new App();
        parent = new WorkspaceTabs(null);
        leaf = new WorkspaceLeaf(parent);
        view = new MarkdownView(leaf);
        mockFile = {
            path: 'test.md',
            basename: 'test',
            extension: 'md',
            vault: app.vault,
            parent: null,
            name: 'test.md',
            stat: {
                ctime: Date.now(),
                mtime: Date.now(),
                size: 0
            }
        } as TFile;
    });

    describe('Basic Properties', () => {
        it('should have essential properties', () => {
            expect(view.editor).toBeDefined();
            expect(view.previewMode).toBeDefined();
            expect(view.file).toBeNull();
            expect(view.hoverPopover).toBeNull();
        });

        it('should have the correct view type', () => {
            expect(view.getViewType()).toBe('markdown');
            expect(view.getDisplayText()).toBe('Markdown View');
            expect(view.getIcon()).toBe('document');
        });
    });

    describe('Editing Modes', () => {
        it('should be able to change mode', () => {
            expect(view.getMode()).toBe('source');
            
            view.showPreview();
            expect(view.getMode()).toBe('preview');
            
            view.showEdit();
            expect(view.getMode()).toBe('source');
            
            view.toggleSourceAndPreview();
            expect(view.getMode()).toBe('preview');
        });
    });

    describe('Content Management', () => {
        it('should be able to manage content', () => {
            const testContent = 'Test content';
            view.setViewData(testContent, true);
            expect(view.editor.setValue).toHaveBeenCalledWith(testContent);
            
            (view.editor.getValue as any).mockReturnValue(testContent);
            expect(view.getViewData()).toBe(testContent);
        });

        it('should be able to save', () => {
            view.requestSave();
            expect(view.requestSave).toHaveBeenCalled();
        });
    });

    describe('Editor Methods', () => {
        it('should have functional editing methods', () => {
            expect(view.editor.getValue()).toBe('');
            expect(view.editor.getDoc().getValue()).toBe('');
            expect(view.editor.getSelection()).toBe('');
            expect(view.editor.getLine(0)).toBe('');
            expect(view.editor.somethingSelected()).toBe(false);
            expect(view.editor.hasFocus()).toBe(false);
        });

        it('should have functional cursor manipulation methods', () => {
            const pos = { line: 0, ch: 0 };
            view.editor.setCursor(pos);
            expect(view.editor.setCursor).toHaveBeenCalledWith(pos);
            expect(view.editor.getCursor()).toEqual(pos);
        });

        it('should have functional scrolling methods', () => {
            view.editor.scrollTo(0, 100);
            expect(view.editor.scrollTo).toHaveBeenCalledWith(0, 100);

            const range = { from: { line: 0, ch: 0 }, to: { line: 1, ch: 0 } };
            view.editor.scrollIntoView(range);
            expect(view.editor.scrollIntoView).toHaveBeenCalledWith(range);
        });
    });

    describe('Lifecycle Methods', () => {
        it('should correctly handle file loading and unloading', async () => {
            await view.onLoadFile(mockFile);
            expect(view.file).toBe(mockFile);

            await view.onUnloadFile(mockFile);
            expect(view.file).toBeNull();
        });

        it('should correctly handle file renaming', async () => {
            view.file = mockFile;
            await view.onRename(mockFile);
            expect(view.file).toBe(mockFile);
        });

        it('should correctly handle view state', async () => {
            const state = { file: 'test.md' };
            await view.setState(state, { history: false });
            expect(view.file).toBeDefined();
        });
    });

    describe('Utility Methods', () => {
        it('should have a functional clear method', () => {
            view.clear();
            expect(view.clear).toHaveBeenCalled();
        });

        it('should have a functional canAcceptExtension method', () => {
            expect(view.canAcceptExtension()).toBe(true);
            expect(view.canAcceptExtension).toHaveBeenCalled();
        });

        it('should have a functional getContext method', () => {
            expect(view.getContext()).toEqual({});
            expect(view.getContext).toHaveBeenCalled();
        });
    });

    describe('Advanced Preview Mode Management', () => {
        it('should correctly handle markdown post-processors', () => {
            const processor = (el: HTMLElement) => {
                el.innerHTML = '<strong>Test</strong>';
                return true;
            };
            
            view.registerMarkdownPostProcessor(processor);
            expect(view.previewMode.registerProcessor).toHaveBeenCalledWith(processor);
        });

        it('should correctly handle preview sections', () => {
            const section = document.createElement('div');
            section.innerHTML = '# Test';
            
            view.previewMode.triggerOnCreate(section);
            expect(section.querySelector('h1')).toBeDefined();
        });

        it('should be able to reload the preview', () => {
            view.previewMode.rerender();
            expect(view.previewMode.rerender).toHaveBeenCalled();
        });
    });

    describe('Advanced Editor Management', () => {
        it('should correctly handle transactions', () => {
            const transaction = {
                changes: [{ from: 0, to: 0, text: 'Test' }],
                selection: { anchor: 0, head: 4 }
            };
            
            view.editor.transaction(transaction);
            expect(view.editor.transaction).toHaveBeenCalledWith(transaction);
        });

        it('should correctly handle history', () => {
            view.editor.undo();
            expect(view.editor.undo).toHaveBeenCalled();

            view.editor.redo();
            expect(view.editor.redo).toHaveBeenCalled();

            view.editor.clearHistory();
            expect(view.editor.clearHistory).toHaveBeenCalled();
        });

        it('should correctly handle multiple selections', () => {
            const selections = [
                { anchor: 0, head: 4 },
                { anchor: 6, head: 10 }
            ];
            
            view.editor.setSelections(selections);
            expect(view.editor.setSelections).toHaveBeenCalledWith(selections);
            
            view.editor.getSelections();
            expect(view.editor.getSelections).toHaveBeenCalled();
        });
    });

    describe('Advanced Event Management', () => {
        it('should emit events on mode changes', () => {
            let called = false;
            view.on('mode-change', () => {
                called = true;
            });

            view.toggleSourceAndPreview();
            expect(called).toBe(true);
        });

        it('should emit events on content modifications', () => {
            let called = false;
            view.on('content-modified', () => {
                called = true;
            });

            view.editor.setValue('Test');
            expect(called).toBe(true);
        });

        it('should emit events on file changes', () => {
            let called = false;
            view.on('file-changed', () => {
                called = true;
            });

            view.onLoadFile(mockFile);
            expect(called).toBe(true);
        });
    });

    describe('Link and Reference Management', () => {
        it('should be able to create links', () => {
            const link = view.createInternalLink('test');
            expect(link).toBe('[[test]]');
        });

        it('should be able to resolve links', () => {
            const resolved = view.resolveLink('test');
            expect(resolved).toBeDefined();
            expect(resolved.path).toBe('test');
        });

        it('should be able to extract references', () => {
            view.editor.setValue('[[test]] #tag ^reference');
            const refs = view.extractReferences();
            expect(refs.links).toContain('test');
            expect(refs.tags).toContain('#tag');
            expect(refs.embeds).toBeDefined();
        });
    });
}); 