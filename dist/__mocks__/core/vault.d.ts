import type { Vault as IVault, TFolder, DataAdapter, TFile as ITFile } from 'obsidian';
import { Events } from '../components/events';
export declare class TFile implements ITFile {
    path: string;
    name: string;
    parent: TFolder | null;
    vault: IVault;
    basename: string;
    extension: string;
    stat: {
        mtime: number;
        ctime: number;
        size: number;
    };
    constructor(path: string, vault: IVault);
}
export declare class Vault extends Events implements IVault {
    adapter: DataAdapter;
    configDir: string;
    files: Map<string, TFile>;
    folders: Map<string, TFolder>;
    private cachedFiles;
    constructor();
    on: import("vitest/dist").Mock<any, any>;
    off: import("vitest/dist").Mock<any, any>;
    setConfig: import("vitest/dist").Mock<any, any>;
    getConfig: import("vitest/dist").Mock<any, any>;
    getName: import("vitest/dist").Mock<any, any>;
    getRoot: import("vitest/dist").Mock<any, any>;
    getAbstractFileByPath: import("vitest/dist").Mock<any, any>;
    getFileByPath: import("vitest/dist").Mock<any, any>;
    getFolderByPath: import("vitest/dist").Mock<any, any>;
    create: import("vitest/dist").Mock<any, any>;
    createBinary: import("vitest/dist").Mock<any, any>;
    createFolder: import("vitest/dist").Mock<any, any>;
    read: import("vitest/dist").Mock<any, any>;
    readBinary: import("vitest/dist").Mock<any, any>;
    delete: import("vitest/dist").Mock<any, any>;
    trash: import("vitest/dist").Mock<any, any>;
    rename: import("vitest/dist").Mock<any, any>;
    modify: import("vitest/dist").Mock<any, any>;
    modifyBinary: import("vitest/dist").Mock<any, any>;
    append: import("vitest/dist").Mock<any, any>;
    process: import("vitest/dist").Mock<any, any>;
    copy: import("vitest/dist").Mock<any, any>;
    getAllLoadedFiles: import("vitest/dist").Mock<any, any>;
    getMarkdownFiles: import("vitest/dist").Mock<any, any>;
    getCachedRead: import("vitest/dist").Mock<any, any>;
    static recurseChildren: import("vitest/dist").Mock<any, any>;
    cachedRead: import("vitest/dist").Mock<any, any>;
    getResourcePath: import("vitest/dist").Mock<any, any>;
    getAllFolders: import("vitest/dist").Mock<any, any>;
    getFiles: import("vitest/dist").Mock<any, any>;
    trigger: import("vitest/dist").Mock<any, any>;
}
