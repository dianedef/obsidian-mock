import { vi } from 'vitest';
import type { FileManager as IFileManager, App, TAbstractFile, TFile, TFolder } from 'obsidian';
import { createMockFile } from '../utils/file-mock';

/**
 * Complete mock of the FileManager
 * @public
 */
export class FileManager implements IFileManager {
    app: App;
    private vault: any;
    private fileTree: Map<string, TAbstractFile> = new Map();

    constructor(app: App) {
        this.app = app;
        this.vault = app.vault;
        // Initialize root folder
        this.fileTree.set('/', this.createFolder('/', null));
    }

    createNewMarkdownFile = vi.fn().mockImplementation(async (
        folder: any,
        filename: string,
        content?: string
    ) => {
        return null;
    });

    /**
     * @public
     */
    getNewFileParent = vi.fn().mockReturnValue(null);

    /**
     * @public
     */
    renameFile = vi.fn().mockResolvedValue(undefined);

    /**
     * @public
     */
    generateMarkdownLink = vi.fn().mockImplementation((
        file: TFile,
        sourcePath: string,
        subpath?: string,
        alias?: string
    ) => {
        return '';
    });

    /**
     * @public
     */
    processFrontMatter = vi.fn().mockImplementation(async (file: TFile, fn: (frontmatter: any) => void) => {
        fn({});
    });

    /**
     * @public
     */
    getAvailablePathForAttachment = vi.fn().mockImplementation(async (filename: string, sourcePath?: string): Promise<string> => {
        // Determine base folder according to preferences
        const basePath = sourcePath 
            ? sourcePath.split('/').slice(0, -1).join('/') 
            : 'attachments';

        // Create attachments folder if needed
        if (!this.fileTree.has(basePath)) {
            const folder = this.createFolder(basePath, this.getOrCreateParentFolder(basePath));
            this.fileTree.set(basePath, folder);
        }

        // Clean filename
        const sanitizedFilename = filename.replace(/[\\/:*?"<>|]/g, '_');
        
        // Check if file already exists
        let newPath = `${basePath}/${sanitizedFilename}`;
        let counter = 1;
        
        while (this.fileTree.has(newPath) || await this.vault.adapter.exists(newPath)) {
            const ext = sanitizedFilename.split('.').pop();
            const base = sanitizedFilename.replace(`.${ext}`, '');
            newPath = `${basePath}/${base} ${counter}.${ext}`;
            counter++;
        }
        
        return newPath;
    });

    trashFile = vi.fn().mockImplementation(async (file: TAbstractFile): Promise<void> => {
        // Remove from fileTree
        this.fileTree.delete(file.path);

        // Update parent
        if (file.parent && file.parent.children) {
            file.parent.children = file.parent.children.filter(child => child !== file);
        }

        // If it's a folder, recursively delete all children
        if ('children' in file && Array.isArray((file as TFolder).children)) {
            for (const child of (file as TFolder).children) {
                await this.trashFile(child);
            }
        }

        // Call vault's delete method
        if (this.vault.delete) {
            await this.vault.delete(file);
        }
    });

    private createFolder(path: string, parent: TFolder | null): TFolder {
        return {
            path,
            name: path.split('/').pop() || '',
            children: [],
            parent,
            vault: this.vault,
            isRoot: () => path === '/'
        } as TFolder;
    }

    private getOrCreateParentFolder(path: string): TFolder {
        const parentPath = path.split('/').slice(0, -1).join('/') || '/';
        let parent = this.fileTree.get(parentPath) as TFolder;
        
        if (!parent) {
            parent = this.createFolder(parentPath, this.getOrCreateParentFolder(parentPath));
            this.fileTree.set(parentPath, parent);
        }

        return parent;
    }

    private getRelativePath(from: string, to: string): string {
        const fromParts = from.split('/').slice(0, -1);
        const toParts = to.split('/');
        
        // Find common prefix
        let i = 0;
        while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
            i++;
        }
        
        // Build relative path
        const upCount = fromParts.length - i;
        const relativeParts = [...Array(upCount).fill('..'), ...toParts.slice(i)];
        
        return relativeParts.join('/');
    }

    save = vi.fn().mockImplementation(async (file: TFile, data: string) => {
        return;
    });

    deleteFile = vi.fn().mockResolvedValue(undefined);
    getAbstractFileByPath = vi.fn().mockReturnValue(null);
    copy = vi.fn().mockResolvedValue(undefined);
    move = vi.fn().mockResolvedValue(undefined);
    getAvailablePath = vi.fn().mockReturnValue('');
    getFileExtension = vi.fn().mockReturnValue('md');
    getBaseName = vi.fn().mockReturnValue('');
    getDisplayPath = vi.fn().mockReturnValue('');
    getUniqueFileName = vi.fn().mockReturnValue('');
} 