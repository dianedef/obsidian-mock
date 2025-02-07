import { vi } from 'vitest';
import type { Plugin } from 'obsidian';
import type { MockStorageServiceType } from '../types/storage';

export class MockStorageService implements MockStorageServiceType {
    private mockData: any = {};

    constructor(private plugin: Plugin) {}

    loadData = vi.fn().mockImplementation(async () => {
        return this.mockData;
    });

    saveData = vi.fn().mockImplementation(async (data: any) => {
        this.mockData = data;
    });

    ensureFolder = vi.fn().mockImplementation(async (path: string) => {
        const exists = await this.plugin.app.vault.adapter.exists(path);
        if (!exists) {
            await this.plugin.app.vault.adapter.mkdir(path);
        }
    });

    removeFolder = vi.fn().mockImplementation(async (path: string) => {
        const exists = await this.plugin.app.vault.adapter.exists(path);
        if (exists) {
            const folder = this.plugin.app.vault.getAbstractFileByPath(path);
            if (folder) {
                await this.plugin.app.vault.delete(folder, true);
            }
        }
    });

    // Utility methods for testing
    setMockData(data: any) {
        this.mockData = {
            ...this.mockData,
            ...data
        };
    }

    getMockData(): any {
        return this.mockData;
    }

    resetMockData() {
        this.mockData = {};
    }
} 