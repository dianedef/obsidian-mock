import type { Plugin } from 'obsidian';

export interface MockStorageServiceType {
    loadData(): Promise<any>;
    saveData(data: any): Promise<void>;
    ensureFolder(path: string): Promise<void>;
    removeFolder(path: string): Promise<void>;
    setMockData(data: any): void;
    getMockData(): any;
    resetMockData(): void;
} 