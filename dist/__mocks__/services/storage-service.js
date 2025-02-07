import { vi } from 'vitest';
export class MockStorageService {
    constructor(plugin) {
        this.plugin = plugin;
        this.mockData = {};
        this.loadData = vi.fn().mockImplementation(async () => {
            return this.mockData;
        });
        this.saveData = vi.fn().mockImplementation(async (data) => {
            this.mockData = data;
        });
        this.ensureFolder = vi.fn().mockImplementation(async (path) => {
            const exists = await this.plugin.app.vault.adapter.exists(path);
            if (!exists) {
                await this.plugin.app.vault.adapter.mkdir(path);
            }
        });
        this.removeFolder = vi.fn().mockImplementation(async (path) => {
            const exists = await this.plugin.app.vault.adapter.exists(path);
            if (exists) {
                const folder = this.plugin.app.vault.getAbstractFileByPath(path);
                if (folder) {
                    await this.plugin.app.vault.delete(folder, true);
                }
            }
        });
    }
    // Utility methods for testing
    setMockData(data) {
        this.mockData = {
            ...this.mockData,
            ...data
        };
    }
    getMockData() {
        return this.mockData;
    }
    resetMockData() {
        this.mockData = {};
    }
}
