import { describe, it, expect, beforeEach } from 'vitest';
import { MockDataAdapter } from '../../__mocks__/core/data-adapter';

describe('MockDataAdapter', () => {
    let adapter: MockDataAdapter;

    beforeEach(() => {
        adapter = new MockDataAdapter();
    });

    describe('Opérations de base', () => {
        it('devrait avoir un nom', () => {
            expect(adapter.getName()).toBe('mock-data-adapter');
        });

        it('devrait vérifier l\'existence des fichiers', async () => {
            await adapter.write('test.md', 'contenu');
            expect(await adapter.exists('test.md')).toBe(true);
            expect(await adapter.exists('inexistant.md')).toBe(false);
        });

        it('devrait obtenir les stats des fichiers', async () => {
            await adapter.write('test.md', 'contenu');
            const stats = await adapter.stat('test.md');
            expect(stats.type).toBe('file');
            expect(stats.size).toBe(7);
            expect(stats.ctime).toBeDefined();
            expect(stats.mtime).toBeDefined();
        });
    });

    describe('Opérations sur les fichiers', () => {
        it('devrait lire et écrire des fichiers texte', async () => {
            await adapter.write('test.md', 'contenu');
            expect(await adapter.read('test.md')).toBe('contenu');
        });

        it('devrait lire et écrire des fichiers binaires', async () => {
            const data = new TextEncoder().encode('contenu').buffer;
            await adapter.writeBinary('test.bin', data);
            const result = await adapter.readBinary('test.bin');
            expect(new TextDecoder().decode(result)).toBe('contenu');
        });

        it('devrait supprimer des fichiers', async () => {
            await adapter.write('test.md', 'contenu');
            await adapter.remove('test.md');
            expect(await adapter.exists('test.md')).toBe(false);
        });

        it('devrait renommer des fichiers', async () => {
            await adapter.write('test.md', 'contenu');
            await adapter.rename('test.md', 'nouveau.md');
            expect(await adapter.exists('test.md')).toBe(false);
            expect(await adapter.exists('nouveau.md')).toBe(true);
            expect(await adapter.read('nouveau.md')).toBe('contenu');
        });

        it('devrait copier des fichiers', async () => {
            await adapter.write('test.md', 'contenu');
            await adapter.copy('test.md', 'copie.md');
            expect(await adapter.exists('test.md')).toBe(true);
            expect(await adapter.exists('copie.md')).toBe(true);
            expect(await adapter.read('copie.md')).toBe('contenu');
        });
    });

    describe('Opérations sur les dossiers', () => {
        it('devrait créer des dossiers', async () => {
            await adapter.mkdir('dossier');
            expect(await adapter.exists('dossier')).toBe(true);
        });

        it('devrait lister le contenu des dossiers', async () => {
            await adapter.mkdir('dossier');
            await adapter.write('dossier/test1.md', 'contenu1');
            await adapter.write('dossier/test2.md', 'contenu2');
            
            const liste = await adapter.list('dossier');
            expect(liste.files).toContain('dossier/test1.md');
            expect(liste.files).toContain('dossier/test2.md');
            expect(liste.folders).toHaveLength(0);
        });

        it('devrait supprimer des dossiers récursivement', async () => {
            await adapter.mkdir('dossier');
            await adapter.write('dossier/test1.md', 'contenu1');
            await adapter.write('dossier/test2.md', 'contenu2');
            
            await adapter.rmdir('dossier', true);
            expect(await adapter.exists('dossier')).toBe(false);
            expect(await adapter.exists('dossier/test1.md')).toBe(false);
            expect(await adapter.exists('dossier/test2.md')).toBe(false);
        });
    });

    describe('Opérations de corbeille', () => {
        it('devrait déplacer les fichiers vers la corbeille système', async () => {
            await adapter.write('test.md', 'contenu');
            await adapter.trashSystem('test.md');
            expect(await adapter.exists('test.md')).toBe(false);
        });

        it('devrait déplacer les fichiers vers la corbeille locale', async () => {
            await adapter.write('test.md', 'contenu');
            await adapter.trashLocal('test.md');
            expect(await adapter.exists('test.md')).toBe(false);
        });
    });

    describe('Gestion des ressources', () => {
        it('devrait générer des chemins de ressources', () => {
            const path = adapter.getResourcePath('image.png');
            expect(path).toBe('app://local/image.png');
        });
    });

    describe('Gestion des erreurs', () => {
        it('devrait gérer les erreurs de lecture de fichiers inexistants', async () => {
            await expect(adapter.read('inexistant.md')).rejects.toThrow('File not found');
        });

        it('devrait gérer les erreurs de lecture binaire de fichiers inexistants', async () => {
            await expect(adapter.readBinary('inexistant.bin')).rejects.toThrow('File not found');
        });

        it('devrait gérer les erreurs de stats de fichiers inexistants', async () => {
            await expect(adapter.stat('inexistant.md')).rejects.toThrow('File not found');
        });
    });
}); 