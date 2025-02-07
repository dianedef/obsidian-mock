import { describe, it, expect, beforeEach } from 'vitest';
import { MockMetadataCache } from '../../__mocks__/core/metadata-cache';
describe('MockMetadataCache', () => {
    let cache;
    let mockFile;
    beforeEach(() => {
        cache = new MockMetadataCache();
        mockFile = {
            path: 'test.md',
            basename: 'test',
            extension: 'md',
            stat: { ctime: Date.now(), mtime: Date.now(), size: 0 },
            parent: null,
            vault: null,
            name: 'test.md'
        };
    });
    describe('Gestion des événements', () => {
        it('devrait gérer les abonnements aux événements', () => {
            const callback = () => { };
            const eventRef = cache.on('change', callback);
            expect(eventRef).toEqual({ id: 'event-ref' });
            expect(cache.on).toHaveBeenCalledWith('change', callback);
        });
        it('devrait gérer le désabonnement aux événements', () => {
            const callback = () => { };
            cache.off('change', callback);
            expect(cache.off).toHaveBeenCalledWith('change', callback);
        });
    });
    describe('Gestion du cache', () => {
        it('devrait gérer le cache des fichiers', () => {
            const metadata = {
                links: [],
                embeds: [],
                tags: [],
                headings: []
            };
            cache.setCacheForFile(mockFile, metadata);
            expect(cache.getCache(mockFile.path)).toStrictEqual(metadata);
            expect(cache.getFileCache(mockFile)).toStrictEqual(metadata);
        });
        it('devrait supprimer le cache des fichiers', () => {
            const metadata = {
                links: [],
                embeds: [],
                tags: [],
                headings: []
            };
            cache.setCacheForFile(mockFile, metadata);
            cache.deleteCacheForFile(mockFile);
            expect(cache.getCache(mockFile)).toBeNull();
        });
    });
    describe('Gestion des liens', () => {
        it('devrait convertir les fichiers en texte de lien', () => {
            const linktext = cache.fileToLinktext(mockFile, '', false);
            expect(linktext).toBe('test.md');
            const linktextWithoutExt = cache.fileToLinktext(mockFile, '', true);
            expect(linktextWithoutExt).toBe('test');
        });
        it('devrait résoudre les liens', () => {
            const resolvedFile = cache.resolveLink('test', '');
            expect(resolvedFile).toBeNull();
        });
        it('devrait retourner les suggestions de liens', () => {
            const suggestions = cache.getLinkSuggestions();
            expect(Array.isArray(suggestions)).toBe(true);
            expect(suggestions).toHaveLength(0);
        });
    });
    describe('Création des caches', () => {
        it('devrait créer un cache de frontmatter', () => {
            const frontmatter = { title: 'Test' };
            const cache1 = cache.createFrontMatterCache(frontmatter);
            expect(cache1.position).toBeDefined();
            expect(cache1.title).toBe('Test');
        });
        it('devrait créer un cache de titre', () => {
            const heading = cache.createHeadingCache('Test', 1, 0);
            expect(heading.heading).toBe('Test');
            expect(heading.level).toBe(1);
            expect(heading.position).toBeDefined();
        });
        it('devrait créer un cache de lien', () => {
            const link = cache.createLinkCache('[[test]]', 0);
            expect(link.link).toBe('[[test]]');
            expect(link.position).toBeDefined();
        });
        it('devrait créer un cache de tag', () => {
            const tag = cache.createTagCache('#test', 0);
            expect(tag.tag).toBe('#test');
            expect(tag.position).toBeDefined();
        });
        it('devrait créer un cache d\'embed', () => {
            const embed = cache.createEmbedCache('![[test]]', 0);
            expect(embed.link).toBe('![[test]]');
            expect(embed.position).toBeDefined();
        });
        it('devrait créer un cache d\'élément de liste', () => {
            const item = cache.createListItemCache('- test', 0);
            expect(item.position).toBeDefined();
            expect(item.task).toBeNull();
        });
        it('devrait créer un cache de section', () => {
            const section = cache.createSectionCache(0, 'paragraph');
            expect(section.type).toBe('paragraph');
            expect(section.position).toBeDefined();
        });
        it('devrait créer un cache de bloc', () => {
            const block = cache.createBlockCache('test-id', 'code', 0);
            expect(block.id).toBe('test-id');
            expect(block.type).toBe('code');
            expect(block.position).toBeDefined();
        });
    });
    describe('Getters de cache', () => {
        it('devrait retourner les tags', () => {
            const tags = cache.getTags();
            expect(tags instanceof Map).toBe(true);
        });
        it('devrait retourner les backlinks', () => {
            const backlinks = cache.getBacklinks();
            expect(backlinks instanceof Map).toBe(true);
        });
        it('devrait retourner les liens', () => {
            const links = cache.getLinks();
            expect(links instanceof Map).toBe(true);
        });
        it('devrait retourner les liens résolus', () => {
            const resolvedLinks = cache.getResolvedLinks();
            expect(resolvedLinks instanceof Map).toBe(true);
        });
        it('devrait retourner le cache des blocs', () => {
            const blockCache = cache.getBlockCache();
            expect(blockCache instanceof Map).toBe(true);
        });
    });
});
