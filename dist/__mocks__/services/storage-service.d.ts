import type { Plugin } from 'obsidian';
import type { MockStorageServiceType } from '../types/storage';
export declare class MockStorageService implements MockStorageServiceType {
    private plugin;
    private mockData;
    constructor(plugin: Plugin);
    loadData: import("vitest/dist").Mock<any, any>;
    saveData: import("vitest/dist").Mock<any, any>;
    ensureFolder: import("vitest/dist").Mock<any, any>;
    removeFolder: import("vitest/dist").Mock<any, any>;
    setMockData(data: any): void;
    getMockData(): any;
    resetMockData(): void;
}
