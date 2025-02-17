import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../__mocks__/core/app';
import { FileExplorerView } from '../../views/file-explorer-view';
import { WorkspaceLeaf } from '../../__mocks__/core/workspace-leaf';
import type { TFile } from 'obsidian';
import { TFile as MockTFile } from '../../__mocks__/core/file';

describe('FileExplorerView', () => {
    let app: App;
    let view: FileExplorerView;
    let testFile: TFile;

    beforeEach(() => {
        app = new App();
        const leaf = new WorkspaceLeaf(app, app.workspace.rootSplit);
        view = new FileExplorerView(leaf);
        testFile = new MockTFile('test.md', app.vault);
    });

    describe('Initialization', () => {
        it('should have the correct view type', () => {
            expect(view.getViewType()).toBe('file-explorer');
        });

        it('should have the correct display text', () => {
            expect(view.getDisplayText()).toBe('File Explorer');
        });

        it('should initialize a basic user interface', () => {
            expect(view.containerEl.classList.contains('file-explorer-view')).toBe(true);
        });
    });

    describe('File Management', () => {
        it('should allow adding files', () => {
            view.addFile(testFile);
            const selectedFile = view.getSelectedFile();
            expect(selectedFile).toBeNull();
        });

        it('should allow removing files', () => {
            view.addFile(testFile);
            view.removeFile(testFile);
            const selectedFile = view.getSelectedFile();
            expect(selectedFile).toBeNull();
        });

        it('should allow selecting files', () => {
            view.addFile(testFile);
            view.selectFile(testFile);
            expect(view.getSelectedFile()).toBe(testFile);
        });

        it('should deselect the file after its removal', () => {
            view.addFile(testFile);
            view.selectFile(testFile);
            view.removeFile(testFile);
            expect(view.getSelectedFile()).toBeNull();
        });
    });
}); 
