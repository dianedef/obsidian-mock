import { vi } from 'vitest';
import type { 
    Vault as IVault, 
    TAbstractFile, 
    DataAdapter,
    ListedFiles,
    Stat,
    EventRef,
    DataWriteOptions
} from 'obsidian';
import { Events } from '../components/events';
import { TFile } from './file';
import { TFolder } from './folder';

export class MockAdapter implements DataAdapter {
    private fileContents: Map<string, string> = new Map();
    private fileBinaryContents: Map<string, ArrayBuffer> = new Map();

    getName = vi.fn().mockReturnValue('mock-adapter');
    read = vi.fn().mockImplementation(async (normalizedPath: string): Promise<string> => {
        return this.fileContents.get(normalizedPath) || '';
    });
    write = vi.fn().mockImplementation(async (normalizedPath: string, data: string): Promise<void> => {
        this.fileContents.set(normalizedPath, data);
    });
    list = vi.fn().mockImplementation(async (normalizedPath: string): Promise<ListedFiles> => {
        return {
            files: Array.from(this.fileContents.keys()),
            folders: []
        };
    });

    async exists(normalizedPath: string, sensitive?: boolean): Promise<boolean> {
        return this.fileContents.has(normalizedPath) || this.fileBinaryContents.has(normalizedPath);
    }

    async stat(normalizedPath: string): Promise<Stat | null> {
        const content = this.fileContents.get(normalizedPath);
        const binaryContent = this.fileBinaryContents.get(normalizedPath);
        if (!content && !binaryContent) return null;
        
        return {
            type: 'file',
            ctime: Date.now(),
            mtime: Date.now(),
            size: content ? content.length : (binaryContent ? binaryContent.byteLength : 0)
        };
    }

    async readBinary(normalizedPath: string): Promise<ArrayBuffer> {
        return this.fileBinaryContents.get(normalizedPath) || new ArrayBuffer(0);
    }

    async writeBinary(normalizedPath: string, data: ArrayBuffer, options?: DataWriteOptions): Promise<void> {
        this.fileBinaryContents.set(normalizedPath, data);
    }

    async append(normalizedPath: string, data: string, options?: DataWriteOptions): Promise<void> {
        const existingContent = await this.read(normalizedPath);
        await this.write(normalizedPath, existingContent + data, options);
    }

    async process(normalizedPath: string, fn: (data: string) => string, options?: DataWriteOptions): Promise<string> {
        const data = await this.read(normalizedPath);
        const newData = fn(data);
        await this.write(normalizedPath, newData, options);
        return newData;
    }

    getResourcePath(normalizedPath: string): string {
        return normalizedPath;
    }

    async mkdir(normalizedPath: string): Promise<void> {
        // Mock implementation
    }

    async trashSystem(normalizedPath: string): Promise<boolean> {
        this.fileContents.delete(normalizedPath);
        this.fileBinaryContents.delete(normalizedPath);
        return true;
    }

    async trashLocal(normalizedPath: string): Promise<void> {
        this.fileContents.delete(normalizedPath);
        this.fileBinaryContents.delete(normalizedPath);
    }

    async rmdir(normalizedPath: string, recursive: boolean): Promise<void> {
        // Mock implementation
    }

    async remove(normalizedPath: string): Promise<void> {
        this.fileContents.delete(normalizedPath);
        this.fileBinaryContents.delete(normalizedPath);
    }

    async rename(normalizedPath: string, normalizedNewPath: string): Promise<void> {
        const content = this.fileContents.get(normalizedPath);
        if (content) {
            this.fileContents.set(normalizedNewPath, content);
            this.fileContents.delete(normalizedPath);
        }
        
        const binaryContent = this.fileBinaryContents.get(normalizedPath);
        if (binaryContent) {
            this.fileBinaryContents.set(normalizedNewPath, binaryContent);
            this.fileBinaryContents.delete(normalizedPath);
        }
    }

    async copy(normalizedPath: string, normalizedNewPath: string): Promise<void> {
        const content = this.fileContents.get(normalizedPath);
        if (content) {
            this.fileContents.set(normalizedNewPath, content);
        }
        
        const binaryContent = this.fileBinaryContents.get(normalizedPath);
        if (binaryContent) {
            this.fileBinaryContents.set(normalizedNewPath, binaryContent);
        }
    }
}

export class Vault extends Events implements IVault {
    adapter: MockAdapter = new MockAdapter();
    configDir: string = '';
    files: Map<string, TFile> = new Map();
    folders: Map<string, TFolder> = new Map();
    loaded: boolean = true;

    // Méthodes de base
    on = vi.fn().mockImplementation((name: string, callback: (...data: any) => any): EventRef => {
        return super.on(name, callback);
    });

    off = vi.fn().mockImplementation((name: string, callback: (...data: any) => any): void => {
        super.off(name, callback);
    });

    trigger = vi.fn().mockImplementation((name: string, ...data: any[]): void => {
        super.trigger(name, ...data);
    });

    // Configuration
    setConfig = vi.fn();
    getConfig = vi.fn();

    // Opérations sur les fichiers
    read = vi.fn().mockImplementation(async (file: TFile | string): Promise<string> => {
        const path = typeof file === 'string' ? file : file.path;
        return this.adapter.read(path);
    });

    cachedRead = vi.fn().mockImplementation(async (file: TFile): Promise<string> => {
        return this.adapter.read(file.path);
    });

    create = vi.fn().mockImplementation(async (normalizedPath: string, data: string = ''): Promise<TFile> => {
        await this.adapter.write(normalizedPath, data);
        const file = new TFile(normalizedPath, this as unknown as IVault);
        this.files.set(normalizedPath, file);
        return file;
    });

    createBinary = vi.fn().mockImplementation(async (normalizedPath: string, data: ArrayBuffer): Promise<TFile> => {
        await this.adapter.writeBinary(normalizedPath, data);
        const file = new TFile(normalizedPath, this as unknown as IVault);
        this.files.set(normalizedPath, file);
        return file;
    });

    createFolder = vi.fn().mockImplementation(async (path: string): Promise<TFolder> => {
        await this.adapter.mkdir(path);
        const folder = new TFolder(this as unknown as IVault, path);
        this.folders.set(path, folder);
        return folder;
    });

    modify = vi.fn().mockImplementation(async (file: TFile, data: string): Promise<void> => {
        await this.adapter.write(file.path, data);
    });

    modifyBinary = vi.fn().mockImplementation(async (file: TFile, data: ArrayBuffer): Promise<void> => {
        await this.adapter.writeBinary(file.path, data);
    });

    append = vi.fn().mockImplementation(async (file: TFile, data: string): Promise<void> => {
        const content = await this.read(file.path);
        await this.adapter.write(file.path, content + data);
    });

    // Gestion des fichiers
    delete = vi.fn().mockImplementation(async (file: TAbstractFile): Promise<void> => {
        await this.adapter.remove(file.path);
        this.files.delete(file.path);
    });

    trash = vi.fn().mockImplementation(async (file: TAbstractFile, system: boolean): Promise<void> => {
        if (system) {
            await this.adapter.trashSystem(file.path);
        } else {
            await this.adapter.trashLocal(file.path);
        }
        this.files.delete(file.path);
    });

    rename = vi.fn().mockImplementation(async (file: TAbstractFile, newPath: string): Promise<void> => {
        await this.adapter.rename(file.path, newPath);
        if (file instanceof TFile) {
            this.files.delete(file.path);
            file.path = newPath;
            this.files.set(newPath, file);
        }
    });

    copy = vi.fn().mockImplementation(async (file: TFile, newPath: string): Promise<TFile> => {
        await this.adapter.copy(file.path, newPath);
        const newFile = new TFile(newPath, this as unknown as IVault);
        this.files.set(newPath, newFile);
        return newFile;
    });

    // Méthodes de requête
    getAbstractFileByPath = vi.fn().mockImplementation((path: string): TAbstractFile | null => {
        return this.files.get(path) || this.folders.get(path) || null;
    });

    getFileByPath = vi.fn().mockImplementation((path: string): TFile | null => {
        return this.files.get(path) || null;
    });

    getFolderByPath = vi.fn().mockImplementation((path: string): TFolder | null => {
        return this.folders.get(path) || null;
    });

    getAllLoadedFiles = vi.fn().mockImplementation((): TAbstractFile[] => {
        return [...this.files.values(), ...this.folders.values()];
    });

    getMarkdownFiles = vi.fn().mockImplementation((): TFile[] => {
        return Array.from(this.files.values()).filter(file => file.extension === 'md');
    });

    getFolders = vi.fn().mockImplementation((): TFolder[] => {
        return Array.from(this.folders.values());
    });

    getAllFolders = vi.fn().mockImplementation((): TFolder[] => {
        return Array.from(this.folders.values());
    });

    getFiles = vi.fn().mockImplementation((): TFile[] => {
        return Array.from(this.files.values());
    });

    getResourcePath = vi.fn().mockImplementation((file: TFile): string => {
        return this.adapter.getResourcePath(file.path);
    });

    readBinary = vi.fn().mockImplementation(async (file: TFile): Promise<ArrayBuffer> => {
        return this.adapter.readBinary(file.path);
    });

    getRoot = vi.fn().mockImplementation((): TFolder => {
        return new TFolder(this as unknown as IVault, '/');
    });

    getName = vi.fn().mockReturnValue('mock-vault');
    process = vi.fn();
}
