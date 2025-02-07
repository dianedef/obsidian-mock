import type { DataAdapter } from 'obsidian';
/**
 * Mock de base pour l'interface DataAdapter
 * @public
 */
export declare class MockDataAdapter implements DataAdapter {
    private files;
    private folders;
    getName: import("vitest/dist").Mock<any, any>;
    exists: import("vitest/dist").Mock<any, any>;
    stat: import("vitest/dist").Mock<any, any>;
    list: import("vitest/dist").Mock<any, any>;
    read: import("vitest/dist").Mock<any, any>;
    readBinary: import("vitest/dist").Mock<any, any>;
    write: import("vitest/dist").Mock<any, any>;
    writeBinary: import("vitest/dist").Mock<any, any>;
    getResourcePath: import("vitest/dist").Mock<any, any>;
    mkdir: import("vitest/dist").Mock<any, any>;
    trashSystem: import("vitest/dist").Mock<any, any>;
    trashLocal: import("vitest/dist").Mock<any, any>;
    rmdir: import("vitest/dist").Mock<any, any>;
    remove: import("vitest/dist").Mock<any, any>;
    rename: import("vitest/dist").Mock<any, any>;
    copy: import("vitest/dist").Mock<any, any>;
    append: import("vitest/dist").Mock<any, any>;
    process: import("vitest/dist").Mock<any, any>;
}
