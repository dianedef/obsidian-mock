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
export const createMockVault = () => minimalVaultMock;
// Mock Plugin minimal
export const createMockPlugin = (vault) => ({
    app: { vault },
    manifest: { id: 'test' },
    vault
});
// Mock File minimal
export const createMockFile = (path, mtime) => ({
    path,
    stat: { mtime, ctime: mtime, size: 0 },
    basename: path.split('/').pop()?.split('.')[0] || '',
    extension: path.split('.').pop() || '',
    vault: minimalVaultMock,
    name: path.split('/').pop() || '',
    parent: null
});
