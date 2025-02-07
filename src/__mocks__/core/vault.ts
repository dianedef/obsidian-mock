import { vi } from 'vitest';
import type { 
    Vault as IVault, 
    TAbstractFile, 
    TFolder,
    DataAdapter,
    ListedFiles,
    TFile as ITFile
} from 'obsidian';
import { Events } from '../components/events';

export class TFile implements ITFile {
    path: string;
    name: string;
    parent: TFolder | null;
    vault: IVault;
    basename: string;
    extension: string;
    stat: { mtime: number; ctime: number; size: number; };

    constructor(path: string, vault: IVault) {
        this.path = path;
        this.name = path.split('/').pop() || '';
        this.parent = null;
        this.vault = vault;
        this.basename = this.name.replace(/\.[^/.]+$/, '');
        this.extension = this.name.split('.').pop() || '';
        this.stat = {
            mtime: Date.now(),
            ctime: Date.now(),
            size: 0
        };
    }
}

export class Vault extends Events implements IVault {
    adapter: DataAdapter;
    configDir: string = '';
    files: Map<string, TFile> = new Map();
    folders: Map<string, TFolder> = new Map();
    private cachedFiles: Map<string, string> = new Map();

    constructor() {
        super();
        this.adapter = {
            getName: vi.fn().mockReturnValue('test'),
            list: vi.fn().mockResolvedValue({ files: [], folders: [] } as ListedFiles),
            read: vi.fn().mockResolvedValue(''),
            readBinary: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
            write: vi.fn().mockResolvedValue(undefined),
            writeBinary: vi.fn().mockResolvedValue(undefined),
            append: vi.fn().mockResolvedValue(undefined),
            process: vi.fn().mockResolvedValue(undefined),
            mkdir: vi.fn().mockResolvedValue(undefined),
            exists: vi.fn().mockResolvedValue(true),
            stat: vi.fn().mockResolvedValue({ mtime: Date.now(), size: 0, ctime: Date.now() }),
            remove: vi.fn().mockResolvedValue(undefined),
            rename: vi.fn().mockResolvedValue(undefined),
            copy: vi.fn().mockResolvedValue(undefined),
            trashSystem: vi.fn().mockResolvedValue(undefined),
            trashLocal: vi.fn().mockResolvedValue(undefined),
            rmdir: vi.fn().mockResolvedValue(undefined),
            getResourcePath: vi.fn().mockReturnValue(''),
            setFullPath: vi.fn(),
            getFullPath: vi.fn().mockReturnValue('')
        } as unknown as DataAdapter;
    }

    on = vi.fn().mockImplementation((name: string, callback: (...data: any) => any) => {
        return { id: 'event-ref', name, callback };
    });

    off = vi.fn();

    setConfig = vi.fn();
    getConfig = vi.fn().mockReturnValue({});

    getName = vi.fn().mockReturnValue('test');
    getRoot = vi.fn().mockReturnValue({
        path: '/',
        name: '/',
        vault: this,
        parent: null,
        children: [],
        isRoot: () => true
    } as TFolder);

    getAbstractFileByPath = vi.fn().mockImplementation((path: string): TAbstractFile | null => {
        return this.files.get(path) || this.folders.get(path) || null;
    });

    getFileByPath = vi.fn().mockImplementation((path: string): TFile | null => {
        return this.files.get(path) || null;
    });

    getFolderByPath = vi.fn().mockImplementation((path: string): TFolder | null => {
        return this.folders.get(path) || null;
    });

    create = vi.fn().mockImplementation((path: string, data: string): Promise<TFile> => {
        const file = {
            path,
            name: path.split('/').pop() || '',
            vault: this,
            parent: this.getRoot(),
            stat: { size: data.length, mtime: Date.now(), ctime: Date.now() },
            basename: path.split('/').pop()?.split('.')[0] || '',
            extension: path.split('.').pop() || ''
        } as TFile;
        this.files.set(path, file);
        return Promise.resolve(file);
    });

    createBinary = vi.fn().mockImplementation((path: string, data: ArrayBuffer): Promise<TFile> => {
        const file = {
            path,
            name: path.split('/').pop() || '',
            vault: this,
            parent: this.getRoot(),
            stat: { size: data.byteLength, mtime: Date.now(), ctime: Date.now() },
            basename: path.split('/').pop()?.split('.')[0] || '',
            extension: path.split('.').pop() || ''
        } as TFile;
        this.files.set(path, file);
        return Promise.resolve(file);
    });

    createFolder = vi.fn().mockImplementation((path: string): Promise<TFolder> => {
        const folder = {
            path,
            name: path.split('/').pop() || '',
            vault: this,
            parent: this.getRoot(),
            children: [],
            isRoot: () => false
        } as TFolder;
        this.folders.set(path, folder);
        return Promise.resolve(folder);
    });

    read = vi.fn().mockResolvedValue('');
    readBinary = vi.fn().mockResolvedValue(new ArrayBuffer(0));
    
    delete = vi.fn().mockImplementation((file: TAbstractFile, force?: boolean): Promise<void> => {
        if (file instanceof TFile) {
            this.files.delete(file.path);
        } else {
            this.folders.delete(file.path);
        }
        return Promise.resolve();
    });

    trash = vi.fn().mockImplementation((file: TAbstractFile, force?: boolean): Promise<void> => {
        return this.delete(file, force);
    });

    rename = vi.fn().mockImplementation((file: TAbstractFile, newPath: string): Promise<void> => {
        if (file instanceof TFile) {
            this.files.delete(file.path);
            file.path = newPath;
            this.files.set(newPath, file);
        }
        return Promise.resolve();
    });

    modify = vi.fn().mockResolvedValue(undefined);
    modifyBinary = vi.fn().mockResolvedValue(undefined);
    append = vi.fn().mockResolvedValue(undefined);
    process = vi.fn().mockResolvedValue(undefined);
    copy = vi.fn().mockImplementation(async (file: TFile, newPath: string): Promise<TFile> => {
        const newFile = { ...file, path: newPath };
        this.files.set(newPath, newFile as TFile);
        return newFile as TFile;
    });

    getAllLoadedFiles = vi.fn().mockReturnValue([]);
    getMarkdownFiles = vi.fn().mockReturnValue([]);
    getCachedRead = vi.fn().mockReturnValue(null);

    static recurseChildren = vi.fn().mockImplementation((folder: TFolder, cb: (file: TAbstractFile) => any): void => {
        folder.children.forEach(child => {
            cb(child);
            if ('children' in child) {
                Vault.recurseChildren(child as TFolder, cb);
            }
        });
    });

    cachedRead = vi.fn().mockImplementation((path: string) => this.cachedFiles.get(path) || null);
    getResourcePath = vi.fn().mockReturnValue('');
    getAllFolders = vi.fn().mockReturnValue([]);
    getFiles = vi.fn().mockReturnValue([]);

    trigger = vi.fn().mockReturnThis();
}
