import { vi } from 'vitest';
import { MockDataAdapter } from './data-adapter';
/**
 * Implementation of DataAdapter for desktop
 * @public
 */
export class FileSystemAdapter extends MockDataAdapter {
    constructor(basePath = '/mock-vault') {
        super();
        this.getName = vi.fn().mockReturnValue('file-system-adapter');
        this.getResourcePath = vi.fn().mockImplementation((normalizedPath) => {
            return `${this.resourcePath}/${normalizedPath}`;
        });
        this.trashSystem = vi.fn().mockImplementation(async (normalizedPath) => {
            // Simulate system deletion
            await this.remove(normalizedPath);
            return true;
        });
        this.trashLocal = vi.fn().mockImplementation(async (normalizedPath) => {
            // Move to .trash folder
            const trashPath = `${this.basePath}/.trash/${normalizedPath}`;
            await this.copy(normalizedPath, trashPath);
            await this.remove(normalizedPath);
        });
        this.append = vi.fn().mockImplementation(async (normalizedPath, data, options) => {
            const existingContent = await this.read(normalizedPath).catch(() => '');
            await this.write(normalizedPath, existingContent + data, options);
        });
        this.process = vi.fn().mockImplementation(async (normalizedPath, fn, options) => {
            const existingContent = await this.read(normalizedPath).catch(() => '');
            const newContent = fn(existingContent);
            await this.write(normalizedPath, newContent, options);
            return newContent;
        });
        this.copy = vi.fn().mockImplementation(async (normalizedPath, normalizedNewPath) => {
            const content = await this.read(normalizedPath).catch(() => null);
            const stat = await this.stat(normalizedPath);
            if (content !== null && stat) {
                await this.write(normalizedNewPath, content, {
                    ctime: Date.now(),
                    mtime: Date.now()
                });
            }
        });
        this.exists = vi.fn().mockImplementation(async (normalizedPath, sensitive = true) => {
            if (!sensitive) {
                const files = await this.list('/');
                const lowerPath = normalizedPath.toLowerCase();
                return files.files.some((f) => f.toLowerCase() === lowerPath) ||
                    files.folders.some((f) => f.toLowerCase() === lowerPath);
            }
            const baseExists = this.exists.getMockImplementation();
            if (baseExists) {
                return baseExists(normalizedPath);
            }
            return false;
        });
        this.stat = vi.fn().mockImplementation(async (normalizedPath) => {
            const baseStat = this.stat.getMockImplementation();
            if (baseStat) {
                const stat = await baseStat(normalizedPath);
                if (stat) {
                    return {
                        ...stat,
                        type: normalizedPath.endsWith('/') ? 'folder' : 'file'
                    };
                }
            }
            return null;
        });
        this.basePath = basePath;
        this.resourcePath = `${basePath}/.resources`;
    }
    getBasePath() {
        return this.basePath;
    }
    getFilePath(normalizedPath) {
        return `file://${this.getFullPath(normalizedPath)}`;
    }
    getFullPath(normalizedPath) {
        return `${this.basePath}/${normalizedPath}`;
    }
    static async readLocalFile(path) {
        // Local file read mock
        return new ArrayBuffer(0);
    }
    static async mkdir(path) {
        // Directory creation mock
        return Promise.resolve();
    }
}
