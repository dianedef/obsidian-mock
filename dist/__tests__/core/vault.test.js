import { Vault } from '../../__mocks__/core/vault';
import { describe, it, expect, beforeEach, vi } from 'vitest';
describe('Vault', () => {
    let vault;
    beforeEach(() => {
        vault = new Vault();
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
            await vault.delete(path);
            expect(vault.delete).toHaveBeenCalledWith(path);
            await vault.trash(path);
            expect(vault.trash).toHaveBeenCalledWith(path);
            await vault.rename(path, newPath);
            expect(vault.rename).toHaveBeenCalledWith(path, newPath);
            await vault.copy(path, newPath);
            expect(vault.copy).toHaveBeenCalledWith(path, newPath);
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
            const path = 'test.md';
            const content = 'test content';
            await vault.adapter.read(path);
            expect(vault.adapter.read).toHaveBeenCalledWith(path);
            await vault.adapter.write(path, content);
            expect(vault.adapter.write).toHaveBeenCalledWith(path, content);
            await vault.adapter.mkdir(path);
            expect(vault.adapter.mkdir).toHaveBeenCalledWith(path);
            await vault.adapter.exists(path);
            expect(vault.adapter.exists).toHaveBeenCalledWith(path);
            await vault.adapter.stat(path);
            expect(vault.adapter.stat).toHaveBeenCalledWith(path);
            await vault.adapter.remove(path);
            expect(vault.adapter.remove).toHaveBeenCalledWith(path);
            const newPath = 'new-test.md';
            await vault.adapter.rename(path, newPath);
            expect(vault.adapter.rename).toHaveBeenCalledWith(path, newPath);
            await vault.adapter.copy(path, newPath);
            expect(vault.adapter.copy).toHaveBeenCalledWith(path, newPath);
        });
        it('devrait avoir les méthodes de gestion des chemins', () => {
            const path = 'test.md';
            vault.adapter.getName();
            expect(vault.adapter.getName).toHaveBeenCalled();
            vault.adapter.list();
            expect(vault.adapter.list).toHaveBeenCalled();
            vault.adapter.setFullPath(path);
            expect(vault.adapter.setFullPath).toHaveBeenCalledWith(path);
            vault.adapter.getFullPath();
            expect(vault.adapter.getFullPath).toHaveBeenCalled();
        });
    });
});
