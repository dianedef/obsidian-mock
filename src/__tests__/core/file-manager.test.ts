import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FileManager } from '../../__mocks__/core/file-manager';
import { App } from '../../__mocks__/core/app';
import { TFile } from '../../__mocks__/core/file';

describe('FileManager', () => {
    let app: App;
    let fileManager: FileManager;
    let mockFile: TFile;

    beforeEach(() => {
        app = new App();
        fileManager = new FileManager(app);
        mockFile = new TFile(app.vault, 'test.md');
        vi.clearAllMocks();
    });

    describe('File Management', () => {
        it('should create new markdown file', async () => {
            const folder = { path: 'test' };
            const filename = 'test.md';
            const content = 'Test content';

            await fileManager.createNewMarkdownFile(folder, filename, content);
            expect(fileManager.createNewMarkdownFile).toHaveBeenCalledWith(folder, filename, content);
        });

        it('should get new file parent', () => {
            const parent = fileManager.getNewFileParent();
            expect(fileManager.getNewFileParent).toHaveBeenCalled();
        });

        it('should rename file', async () => {
            const newPath = 'new/path.md';
            await fileManager.renameFile(mockFile, newPath);
            expect(fileManager.renameFile).toHaveBeenCalledWith(mockFile, newPath);
        });

        it('should generate markdown link', () => {
            const sourcePath = 'source/path.md';
            const subpath = 'subpath';
            const alias = 'alias';

            fileManager.generateMarkdownLink(mockFile, sourcePath, subpath, alias);
            expect(fileManager.generateMarkdownLink).toHaveBeenCalledWith(
                mockFile,
                sourcePath,
                subpath,
                alias
            );
        });

        it('should process front matter', () => {
            fileManager.processFrontMatter(mockFile);
            expect(fileManager.processFrontMatter).toHaveBeenCalledWith(mockFile);
        });

        it('should get available path for attachment', async () => {
            const filename = 'test.jpg';
            const sourcePath = 'notes/note.md';

            await fileManager.getAvailablePathForAttachment(filename, sourcePath);
            expect(fileManager.getAvailablePathForAttachment).toHaveBeenCalledWith(
                filename,
                sourcePath
            );
        });

        it('should trash file', async () => {
            await fileManager.trashFile(mockFile);
            expect(fileManager.trashFile).toHaveBeenCalledWith(mockFile);
        });

        it('should save file', async () => {
            const data = 'file content';
            await fileManager.save(mockFile, data);
            expect(fileManager.save).toHaveBeenCalledWith(mockFile, data);
        });
    });

    describe('File Operations', () => {
        it('should get abstract file by path', () => {
            const path = 'test/path.md';
            fileManager.getAbstractFileByPath(path);
            expect(fileManager.getAbstractFileByPath).toHaveBeenCalledWith(path);
        });

        it('should copy file', async () => {
            const dest = 'dest/path.md';
            await fileManager.copy(mockFile, dest);
            expect(fileManager.copy).toHaveBeenCalledWith(mockFile, dest);
        });

        it('should move file', async () => {
            const dest = 'new/location.md';
            await fileManager.move(mockFile, dest);
            expect(fileManager.move).toHaveBeenCalledWith(mockFile, dest);
        });

        it('should get available path', () => {
            const path = 'test.md';
            fileManager.getAvailablePath(path);
            expect(fileManager.getAvailablePath).toHaveBeenCalledWith(path);
        });

        it('should get file extension', () => {
            const path = 'test.md';
            fileManager.getFileExtension(path);
            expect(fileManager.getFileExtension).toHaveBeenCalledWith(path);
        });

        it('should get base name', () => {
            const path = 'test.md';
            fileManager.getBaseName(path);
            expect(fileManager.getBaseName).toHaveBeenCalledWith(path);
        });

        it('should get display path', () => {
            const path = 'test.md';
            fileManager.getDisplayPath(path);
            expect(fileManager.getDisplayPath).toHaveBeenCalledWith(path);
        });

        it('should get unique file name', () => {
            const name = 'test.md';
            fileManager.getUniqueFileName(name);
            expect(fileManager.getUniqueFileName).toHaveBeenCalledWith(name);
        });
    });
}); 