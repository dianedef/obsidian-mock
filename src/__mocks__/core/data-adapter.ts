import { vi } from 'vitest';
import type { DataAdapter, DataWriteOptions, ListedFiles, Stat } from 'obsidian';

/**
 * Mock de base pour l'interface DataAdapter
 * @public
 */
export class MockDataAdapter implements DataAdapter {
    private files: Map<string, string> = new Map();
    private folders: Set<string> = new Set();

    // Base methods
    getName = vi.fn().mockReturnValue('mock-data-adapter');
    
    // File operations
    exists = vi.fn().mockImplementation(async (normalizedPath: string): Promise<boolean> => {
        return this.files.has(normalizedPath) || this.folders.has(normalizedPath);
    });

    stat = vi.fn().mockImplementation(async (normalizedPath: string): Promise<Stat> => {
        if (!this.files.has(normalizedPath) && !this.folders.has(normalizedPath)) {
            throw new Error('File not found');
        }
        return {
            type: this.files.has(normalizedPath) ? 'file' : 'folder',
            ctime: Date.now(),
            mtime: Date.now(),
            size: this.files.get(normalizedPath)?.length || 0
        };
    });

    list = vi.fn().mockImplementation(async (normalizedPath: string): Promise<ListedFiles> => {
        const files: string[] = [];
        const folders: string[] = [];

        // Normaliser le chemin pour la comparaison
        const prefix = normalizedPath.endsWith('/') ? normalizedPath : normalizedPath + '/';

        // Lister les fichiers
        for (const path of this.files.keys()) {
            if (path.startsWith(prefix)) {
                files.push(path);
            }
        }

        // Lister les dossiers
        for (const folder of this.folders) {
            if (folder.startsWith(prefix) && folder !== normalizedPath) {
                folders.push(folder);
            }
        }

        return { files, folders };
    });

    read = vi.fn().mockImplementation(async (normalizedPath: string): Promise<string> => {
        const content = this.files.get(normalizedPath);
        if (content === undefined) {
            throw new Error('File not found');
        }
        return content;
    });

    readBinary = vi.fn().mockImplementation(async (normalizedPath: string): Promise<ArrayBuffer> => {
        const content = this.files.get(normalizedPath);
        if (content === undefined) {
            throw new Error('File not found');
        }
        return new TextEncoder().encode(content).buffer;
    });

    write = vi.fn().mockImplementation(async (normalizedPath: string, data: string, options?: DataWriteOptions): Promise<void> => {
        this.files.set(normalizedPath, data);
    });

    writeBinary = vi.fn().mockImplementation(async (normalizedPath: string, data: ArrayBuffer, options?: DataWriteOptions): Promise<void> => {
        const content = new TextDecoder().decode(data);
        this.files.set(normalizedPath, content);
    });

    getResourcePath = vi.fn().mockImplementation((normalizedPath: string): string => {
        return `app://local/${normalizedPath}`;
    });

    mkdir = vi.fn().mockImplementation(async (normalizedPath: string): Promise<void> => {
        this.folders.add(normalizedPath);
    });

    trashSystem = vi.fn().mockImplementation(async (normalizedPath: string): Promise<void> => {
        this.files.delete(normalizedPath);
        this.folders.delete(normalizedPath);
    });

    trashLocal = vi.fn().mockImplementation(async (normalizedPath: string): Promise<void> => {
        this.files.delete(normalizedPath);
        this.folders.delete(normalizedPath);
    });

    rmdir = vi.fn().mockImplementation(async (normalizedPath: string, recursive: boolean): Promise<void> => {
        if (recursive) {
            for (const path of this.folders) {
                if (path.startsWith(normalizedPath)) {
                    this.folders.delete(path);
                }
            }
            for (const path of this.files.keys()) {
                if (path.startsWith(normalizedPath)) {
                    this.files.delete(path);
                }
            }
        }
        this.folders.delete(normalizedPath);
    });

    remove = vi.fn().mockImplementation(async (normalizedPath: string): Promise<void> => {
        this.files.delete(normalizedPath);
    });

    rename = vi.fn().mockImplementation(async (normalizedPath: string, normalizedNewPath: string): Promise<void> => {
        const content = this.files.get(normalizedPath);
        if (content !== undefined) {
            this.files.delete(normalizedPath);
            this.files.set(normalizedNewPath, content);
        }
        if (this.folders.has(normalizedPath)) {
            this.folders.delete(normalizedPath);
            this.folders.add(normalizedNewPath);
        }
    });

    copy = vi.fn().mockImplementation(async (normalizedPath: string, normalizedNewPath: string): Promise<void> => {
        const content = this.files.get(normalizedPath);
        if (content !== undefined) {
            this.files.set(normalizedNewPath, content);
        }
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
} 