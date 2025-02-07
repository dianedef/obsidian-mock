import { vi } from 'vitest';
/**
 * Complete mock of the FileManager
 * @public
 */
export class FileManager {
    constructor(app) {
        this.fileTree = new Map();
        this.createNewMarkdownFile = vi.fn().mockImplementation(async (folder, filename, content) => {
            return null;
        });
        /**
         * @public
         */
        this.getNewFileParent = vi.fn().mockReturnValue(null);
        /**
         * @public
         */
        this.renameFile = vi.fn().mockResolvedValue(undefined);
        /**
         * @public
         */
        this.generateMarkdownLink = vi.fn().mockImplementation((file, sourcePath, subpath, alias) => {
            return '';
        });
        /**
         * @public
         */
        this.processFrontMatter = vi.fn().mockImplementation(async (file, fn) => {
            fn({});
        });
        /**
         * @public
         */
        this.getAvailablePathForAttachment = vi.fn().mockImplementation(async (filename, sourcePath) => {
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
        this.trashFile = vi.fn().mockImplementation(async (file) => {
            // Remove from fileTree
            this.fileTree.delete(file.path);
            // Update parent
            if (file.parent && file.parent.children) {
                file.parent.children = file.parent.children.filter(child => child !== file);
            }
            // If it's a folder, recursively delete all children
            if ('children' in file && Array.isArray(file.children)) {
                for (const child of file.children) {
                    await this.trashFile(child);
                }
            }
            // Call vault's delete method
            if (this.vault.delete) {
                await this.vault.delete(file);
            }
        });
        this.save = vi.fn().mockImplementation(async (file, data) => {
            return;
        });
        this.deleteFile = vi.fn().mockResolvedValue(undefined);
        this.getAbstractFileByPath = vi.fn().mockReturnValue(null);
        this.copy = vi.fn().mockResolvedValue(undefined);
        this.move = vi.fn().mockResolvedValue(undefined);
        this.getAvailablePath = vi.fn().mockReturnValue('');
        this.getFileExtension = vi.fn().mockReturnValue('md');
        this.getBaseName = vi.fn().mockReturnValue('');
        this.getDisplayPath = vi.fn().mockReturnValue('');
        this.getUniqueFileName = vi.fn().mockReturnValue('');
        this.app = app;
        this.vault = app.vault;
        // Initialize root folder
        this.fileTree.set('/', this.createFolder('/', null));
    }
    createFolder(path, parent) {
        return {
            path,
            name: path.split('/').pop() || '',
            children: [],
            parent,
            vault: this.vault,
            isRoot: () => path === '/'
        };
    }
    getOrCreateParentFolder(path) {
        const parentPath = path.split('/').slice(0, -1).join('/') || '/';
        let parent = this.fileTree.get(parentPath);
        if (!parent) {
            parent = this.createFolder(parentPath, this.getOrCreateParentFolder(parentPath));
            this.fileTree.set(parentPath, parent);
        }
        return parent;
    }
    getRelativePath(from, to) {
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
}
