import { vi } from 'vitest';
import type { DataAdapter, DataWriteOptions, ListedFiles, Stat } from 'obsidian';
import { MockDataAdapter } from './data-adapter';

/**
 * Implementation of DataAdapter for desktop
 * @public
 */
export class FileSystemAdapter extends MockDataAdapter {
    private basePath: string;
    private resourcePath: string;

    constructor(basePath: string = '/mock-vault') {
        super();
        this.basePath = basePath;
        this.resourcePath = `${basePath}/.resources`;
    }

    getName = vi.fn().mockReturnValue('file-system-adapter');

    getBasePath(): string {
        return this.basePath;
    }

    getResourcePath = vi.fn().mockImplementation((normalizedPath: string): string => {
        return `${this.resourcePath}/${normalizedPath}`;
    });

    getFilePath(normalizedPath: string): string {
        return `file://${this.getFullPath(normalizedPath)}`;
    }

    getFullPath(normalizedPath: string): string {
        return `${this.basePath}/${normalizedPath}`;
    }

    static async readLocalFile(path: string): Promise<ArrayBuffer> {
        // Local file read mock
        return new ArrayBuffer(0);
    }

    static async mkdir(path: string): Promise<void> {
        // Directory creation mock
        return Promise.resolve();
    }

    trashSystem = vi.fn().mockImplementation(async (normalizedPath: string): Promise<boolean> => {
        // Simulate system deletion
        await this.remove(normalizedPath);
        return true;
    });

    trashLocal = vi.fn().mockImplementation(async (normalizedPath: string): Promise<void> => {
        // Move to .trash folder
        const trashPath = `${this.basePath}/.trash/${normalizedPath}`;
        await this.copy(normalizedPath, trashPath);
        await this.remove(normalizedPath);
    });

    append = vi.fn().mockImplementation(async (normalizedPath: string, data: string, options?: DataWriteOptions): Promise<void> => {
        const existingContent = await this.read(normalizedPath).catch(() => '');
        await this.write(normalizedPath, existingContent + data, options);
    });

    process = vi.fn().mockImplementation(async (normalizedPath: string, fn: (data: string) => string, options?: DataWriteOptions): Promise<string> => {
        const existingContent = await this.read(normalizedPath).catch(() => '');
        const newContent = fn(existingContent);
        await this.write(normalizedPath, newContent, options);
        return newContent;
    });

    copy = vi.fn().mockImplementation(async (normalizedPath: string, normalizedNewPath: string): Promise<void> => {
        const content = await this.read(normalizedPath).catch(() => null);
        const stat = await this.stat(normalizedPath);

        if (content !== null && stat) {
            await this.write(normalizedNewPath, content, {
                ctime: Date.now(),
                mtime: Date.now()
            });
        }
    });

    exists = vi.fn().mockImplementation(async (normalizedPath: string, sensitive: boolean = true): Promise<boolean> => {
        if (!sensitive) {
            const files = await this.list('/');
            const lowerPath = normalizedPath.toLowerCase();
            return files.files.some((f: string) => f.toLowerCase() === lowerPath) ||
                   files.folders.some((f: string) => f.toLowerCase() === lowerPath);
        }
        const baseExists = this.exists.getMockImplementation();
        if (baseExists) {
            return baseExists(normalizedPath);
        }
        return false;
    });

    stat = vi.fn().mockImplementation(async (normalizedPath: string): Promise<Stat | null> => {
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
} 