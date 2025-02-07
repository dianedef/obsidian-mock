import { MockDataAdapter } from './data-adapter';
/**
 * Implementation of DataAdapter for desktop
 * @public
 */
export declare class FileSystemAdapter extends MockDataAdapter {
    private basePath;
    private resourcePath;
    constructor(basePath?: string);
    getName: import("vitest/dist").Mock<any, any>;
    getBasePath(): string;
    getResourcePath: import("vitest/dist").Mock<any, any>;
    getFilePath(normalizedPath: string): string;
    getFullPath(normalizedPath: string): string;
    static readLocalFile(path: string): Promise<ArrayBuffer>;
    static mkdir(path: string): Promise<void>;
    trashSystem: import("vitest/dist").Mock<any, any>;
    trashLocal: import("vitest/dist").Mock<any, any>;
    append: import("vitest/dist").Mock<any, any>;
    process: import("vitest/dist").Mock<any, any>;
    copy: import("vitest/dist").Mock<any, any>;
    exists: import("vitest/dist").Mock<any, any>;
    stat: import("vitest/dist").Mock<any, any>;
}
