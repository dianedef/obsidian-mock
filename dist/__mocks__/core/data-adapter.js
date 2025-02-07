import { vi } from 'vitest';
/**
 * Mock de base pour l'interface DataAdapter
 * @public
 */
export class MockDataAdapter {
    constructor() {
        this.files = new Map();
        this.folders = new Set();
        // Base methods
        this.getName = vi.fn().mockReturnValue('mock-data-adapter');
        // File operations
        this.exists = vi.fn().mockImplementation(async (normalizedPath) => {
            return this.files.has(normalizedPath) || this.folders.has(normalizedPath);
        });
        this.stat = vi.fn().mockImplementation(async (normalizedPath) => {
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
        this.list = vi.fn().mockImplementation(async (normalizedPath) => {
            const files = [];
            const folders = [];
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
        this.read = vi.fn().mockImplementation(async (normalizedPath) => {
            const content = this.files.get(normalizedPath);
            if (content === undefined) {
                throw new Error('File not found');
            }
            return content;
        });
        this.readBinary = vi.fn().mockImplementation(async (normalizedPath) => {
            const content = this.files.get(normalizedPath);
            if (content === undefined) {
                throw new Error('File not found');
            }
            return new TextEncoder().encode(content).buffer;
        });
        this.write = vi.fn().mockImplementation(async (normalizedPath, data, options) => {
            this.files.set(normalizedPath, data);
        });
        this.writeBinary = vi.fn().mockImplementation(async (normalizedPath, data, options) => {
            const content = new TextDecoder().decode(data);
            this.files.set(normalizedPath, content);
        });
        this.getResourcePath = vi.fn().mockImplementation((normalizedPath) => {
            return `app://local/${normalizedPath}`;
        });
        this.mkdir = vi.fn().mockImplementation(async (normalizedPath) => {
            this.folders.add(normalizedPath);
        });
        this.trashSystem = vi.fn().mockImplementation(async (normalizedPath) => {
            this.files.delete(normalizedPath);
            this.folders.delete(normalizedPath);
        });
        this.trashLocal = vi.fn().mockImplementation(async (normalizedPath) => {
            this.files.delete(normalizedPath);
            this.folders.delete(normalizedPath);
        });
        this.rmdir = vi.fn().mockImplementation(async (normalizedPath, recursive) => {
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
        this.remove = vi.fn().mockImplementation(async (normalizedPath) => {
            this.files.delete(normalizedPath);
        });
        this.rename = vi.fn().mockImplementation(async (normalizedPath, normalizedNewPath) => {
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
        this.copy = vi.fn().mockImplementation(async (normalizedPath, normalizedNewPath) => {
            const content = this.files.get(normalizedPath);
            if (content !== undefined) {
                this.files.set(normalizedNewPath, content);
            }
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
    }
}
