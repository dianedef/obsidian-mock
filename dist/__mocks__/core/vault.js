import { vi } from 'vitest';
import { Events } from '../components/events';
export class TFile {
    constructor(path, vault) {
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
export class Vault extends Events {
    constructor() {
        super();
        this.configDir = '';
        this.files = new Map();
        this.folders = new Map();
        this.cachedFiles = new Map();
        this.on = vi.fn().mockImplementation((name, callback) => {
            return { id: 'event-ref', name, callback };
        });
        this.off = vi.fn();
        this.setConfig = vi.fn();
        this.getConfig = vi.fn().mockReturnValue({});
        this.getName = vi.fn().mockReturnValue('test');
        this.getRoot = vi.fn().mockReturnValue({
            path: '/',
            name: '/',
            vault: this,
            parent: null,
            children: [],
            isRoot: () => true
        });
        this.getAbstractFileByPath = vi.fn().mockImplementation((path) => {
            return this.files.get(path) || this.folders.get(path) || null;
        });
        this.getFileByPath = vi.fn().mockImplementation((path) => {
            return this.files.get(path) || null;
        });
        this.getFolderByPath = vi.fn().mockImplementation((path) => {
            return this.folders.get(path) || null;
        });
        this.create = vi.fn().mockImplementation((path, data) => {
            const file = {
                path,
                name: path.split('/').pop() || '',
                vault: this,
                parent: this.getRoot(),
                stat: { size: data.length, mtime: Date.now(), ctime: Date.now() },
                basename: path.split('/').pop()?.split('.')[0] || '',
                extension: path.split('.').pop() || ''
            };
            this.files.set(path, file);
            return Promise.resolve(file);
        });
        this.createBinary = vi.fn().mockImplementation((path, data) => {
            const file = {
                path,
                name: path.split('/').pop() || '',
                vault: this,
                parent: this.getRoot(),
                stat: { size: data.byteLength, mtime: Date.now(), ctime: Date.now() },
                basename: path.split('/').pop()?.split('.')[0] || '',
                extension: path.split('.').pop() || ''
            };
            this.files.set(path, file);
            return Promise.resolve(file);
        });
        this.createFolder = vi.fn().mockImplementation((path) => {
            const folder = {
                path,
                name: path.split('/').pop() || '',
                vault: this,
                parent: this.getRoot(),
                children: [],
                isRoot: () => false
            };
            this.folders.set(path, folder);
            return Promise.resolve(folder);
        });
        this.read = vi.fn().mockResolvedValue('');
        this.readBinary = vi.fn().mockResolvedValue(new ArrayBuffer(0));
        this.delete = vi.fn().mockImplementation((file, force) => {
            if (file instanceof TFile) {
                this.files.delete(file.path);
            }
            else {
                this.folders.delete(file.path);
            }
            return Promise.resolve();
        });
        this.trash = vi.fn().mockImplementation((file, force) => {
            return this.delete(file, force);
        });
        this.rename = vi.fn().mockImplementation((file, newPath) => {
            if (file instanceof TFile) {
                this.files.delete(file.path);
                file.path = newPath;
                this.files.set(newPath, file);
            }
            return Promise.resolve();
        });
        this.modify = vi.fn().mockResolvedValue(undefined);
        this.modifyBinary = vi.fn().mockResolvedValue(undefined);
        this.append = vi.fn().mockResolvedValue(undefined);
        this.process = vi.fn().mockResolvedValue(undefined);
        this.copy = vi.fn().mockImplementation(async (file, newPath) => {
            const newFile = { ...file, path: newPath };
            this.files.set(newPath, newFile);
            return newFile;
        });
        this.getAllLoadedFiles = vi.fn().mockReturnValue([]);
        this.getMarkdownFiles = vi.fn().mockReturnValue([]);
        this.getCachedRead = vi.fn().mockReturnValue(null);
        this.cachedRead = vi.fn().mockImplementation((path) => this.cachedFiles.get(path) || null);
        this.getResourcePath = vi.fn().mockReturnValue('');
        this.getAllFolders = vi.fn().mockReturnValue([]);
        this.getFiles = vi.fn().mockReturnValue([]);
        this.trigger = vi.fn().mockReturnThis();
        this.adapter = {
            getName: vi.fn().mockReturnValue('test'),
            list: vi.fn().mockResolvedValue({ files: [], folders: [] }),
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
        };
    }
}
Vault.recurseChildren = vi.fn().mockImplementation((folder, cb) => {
    folder.children.forEach(child => {
        cb(child);
        if ('children' in child) {
            Vault.recurseChildren(child, cb);
        }
    });
});
