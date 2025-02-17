import { Vault } from '../../__mocks__/core/vault';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Vault', () => {
    let vault: Vault;

    beforeEach(() => {
        vault = new Vault();
        vault.adapter.mkdir = vi.fn();
        vault.adapter.exists = vi.fn();
        vault.adapter.read = vi.fn();
        vault.adapter.write = vi.fn();
        vault.adapter.remove = vi.fn();
        vault.adapter.list = vi.fn();
        vault.adapter.getResourcePath = vi.fn();
        vault.adapter.getFullPath = vi.fn();
        vault.adapter.getName = vi.fn();
    });

    describe('Méthodes de base', () => {
        it('devrait avoir les méthodes d\'événements', () => {
            const callback = vi.fn();
            vault.on('test', callback);
            expect(vault.on).toHaveBeenCalledWith('test', callback);

            vault.off('test', callback);
            expect(vault.off).toHaveBeenCalledWith('test', callback);

            vault.trigger('test');
            expect(vault.trigger).toHaveBeenCalledWith('test');
        });

        it('devrait avoir les méthodes de configuration', () => {
            const config = { test: 'value' };
            vault.setConfig('test', config);
            expect(vault.setConfig).toHaveBeenCalledWith('test', config);

            vault.getConfig('test');
            expect(vault.getConfig).toHaveBeenCalledWith('test');
        });
    });

    describe('Opérations sur les fichiers', () => {
        it('devrait avoir les méthodes de lecture/écriture', async () => {
            const path = 'test.md';
            const content = 'test content';

            await vault.read(path);
            expect(vault.read).toHaveBeenCalledWith(path);

            await vault.create(path, content);
            expect(vault.create).toHaveBeenCalledWith(path, content);

            const binaryData = new ArrayBuffer(8);
            await vault.createBinary(path, binaryData);
            expect(vault.createBinary).toHaveBeenCalledWith(path, binaryData);

            await vault.modify(path, content);
            expect(vault.modify).toHaveBeenCalledWith(path, content);
        });

        it('devrait avoir les méthodes de gestion de fichiers', async () => {
            const path = 'test.md';
            const newPath = 'new-test.md';
            const content = 'test content';

            // Créer d'abord le fichier
            const file = await vault.create(path, content);
            expect(vault.create).toHaveBeenCalledWith(path, content);

            await vault.delete(file);
            expect(vault.delete).toHaveBeenCalledWith(file);

            await vault.trash(file);
            expect(vault.trash).toHaveBeenCalledWith(file);

            await vault.rename(file, newPath);
            expect(vault.rename).toHaveBeenCalledWith(file, newPath);

            await vault.copy(file, newPath);
            expect(vault.copy).toHaveBeenCalledWith(file, newPath);
        });

        it('devrait avoir les méthodes de requête de fichiers', () => {
            vault.getAllLoadedFiles();
            expect(vault.getAllLoadedFiles).toHaveBeenCalled();

            const path = 'test.md';
            vault.getAbstractFileByPath(path);
            expect(vault.getAbstractFileByPath).toHaveBeenCalledWith(path);

            vault.getRoot();
            expect(vault.getRoot).toHaveBeenCalled();
        });
    });

    describe('Adapter', () => {
        it('devrait avoir les méthodes de base de l\'adapter', async () => {
            const path = 'test/path';

            await vault.adapter.mkdir(path);
            expect(vault.adapter.mkdir).toHaveBeenCalledWith(path);

            await vault.adapter.exists(path);
            expect(vault.adapter.exists).toHaveBeenCalledWith(path);
        });

        it('devrait avoir les méthodes de gestion des chemins', () => {
            const path = 'test/path';

            vault.adapter.getResourcePath(path);
            expect(vault.adapter.getResourcePath).toHaveBeenCalledWith(path);
        });
    });
}); 