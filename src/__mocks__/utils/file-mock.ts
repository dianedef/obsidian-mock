import { Plugin, TFile, Vault } from 'obsidian';
import { vi } from 'vitest';

// Création d'un mock Vault minimal
const minimalVaultMock = {
    adapter: {
        exists: vi.fn(),
        list: vi.fn(),
        remove: vi.fn(),
        rmdir: vi.fn(),
        mkdir: vi.fn(),
        write: vi.fn()
    },
    getFiles: vi.fn(),
    delete: vi.fn(),
    create: vi.fn(),
    modify: vi.fn(),
    read: vi.fn(),
    createFolder: vi.fn(),
    getAbstractFileByPath: vi.fn()
};

// Réutilisation du même mock pour tous les tests
export const createMockVault = () => minimalVaultMock as unknown as Vault;

// Mock Plugin minimal
export const createMockPlugin = (vault: Vault) => ({
    app: { vault },
    manifest: { id: 'test' },
    vault
}) as unknown as Plugin;

// Mock File minimal
export const createMockFile = (path: string, mtime: number): TFile => ({
    path,
    stat: { mtime, ctime: mtime, size: 0 },
    basename: path.split('/').pop()?.split('.')[0] || '',
    extension: path.split('.').pop() || '',
    vault: minimalVaultMock as unknown as Vault,
    name: path.split('/').pop() || '',
    parent: null
}); 