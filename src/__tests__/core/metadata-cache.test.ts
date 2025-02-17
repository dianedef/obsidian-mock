import { describe, it, expect, beforeEach } from 'vitest';
import { MetadataCache } from '../../__mocks__/core/metadata-cache';
import type { TFile, CachedMetadata } from 'obsidian';

describe('MetadataCache', () => {
    let cache: MetadataCache;
    let mockFile: TFile;

    beforeEach(() => {
        cache = new MetadataCache();
        mockFile = {
            path: 'test.md',
            name: 'test.md',
            basename: 'test',
            extension: 'md',
            parent: null,
            vault: null as any,
            stat: {
                ctime: Date.now(),
                mtime: Date.now(),
                size: 0
            }
        };
    });

    describe('Event Management', () => {
        it('should handle event subscriptions', () => {
            const callback = () => {};
            const eventRef = cache.on('change', callback);
            expect(eventRef).toEqual({ id: 'event-ref' });
            expect(cache.on).toHaveBeenCalledWith('change', callback);
        });

        it('should handle event unsubscriptions', () => {
            const callback = () => {};
            cache.off('change', callback);
            expect(cache.off).toHaveBeenCalledWith('change', callback);
        });
    });

    describe('Cache Management', () => {
        it('should manage file caching', () => {
            const metadata: CachedMetadata = {
                links: [],
                embeds: [],
                tags: [],
                headings: []
            };
            
            cache.setCacheForFile(mockFile, metadata);
            expect(cache.getCache(mockFile.path)).toStrictEqual(metadata);
            expect(cache.getFileCache(mockFile)).toStrictEqual(metadata);
        });

        it('should delete file caching', () => {
            const metadata: CachedMetadata = {
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

    describe('Link Management', () => {
        it('should convert files to link text', () => {
            const linktext = cache.fileToLinktext(mockFile, '', false);
            expect(linktext).toBe('test.md');

            const linktextWithoutExt = cache.fileToLinktext(mockFile, '', true);
            expect(linktextWithoutExt).toBe('test');
        });

        it('should resolve links', () => {
            const resolvedFile = cache.resolveLink('test', '');
            expect(resolvedFile).toBeNull();
        });

        it('should return link suggestions', () => {
            const suggestions = cache.getLinkSuggestions();
            expect(Array.isArray(suggestions)).toBe(true);
            expect(suggestions).toHaveLength(0);
        });
    });

    describe('Cache Creation', () => {
        it('should create a frontmatter cache', () => {
            const frontmatter = { title: 'Test' };
            const cache1 = cache.createFrontMatterCache(frontmatter);
            expect(cache1.position).toBeDefined();
            expect(cache1.title).toBe('Test');
        });

        it('should create a heading cache', () => {
            const heading = cache.createHeadingCache('Test', 1, 0);
            expect(heading.heading).toBe('Test');
            expect(heading.level).toBe(1);
            expect(heading.position).toBeDefined();
        });

        it('should create a link cache', () => {
            const link = cache.createLinkCache('[[test]]', 0);
            expect(link.link).toBe('[[test]]');
            expect(link.position).toBeDefined();
        });

        it('should create a tag cache', () => {
            const tag = cache.createTagCache('#test', 0);
            expect(tag.tag).toBe('#test');
            expect(tag.position).toBeDefined();
        });

        it('should create an embed cache', () => {
            const embed = cache.createEmbedCache('![[test]]', 0);
            expect(embed.link).toBe('![[test]]');
            expect(embed.position).toBeDefined();
        });

        it('should create a list item cache', () => {
            const item = cache.createListItemCache('- test', 0);
            expect(item.position).toBeDefined();
            expect(item.task).toBeNull();
        });

        it('should create a section cache', () => {
            const section = cache.createSectionCache(0, 'paragraph');
            expect(section.type).toBe('paragraph');
            expect(section.position).toBeDefined();
        });

        it('should create a block cache', () => {
            const block = cache.createBlockCache('test-id', 'code', 0);
            expect(block.id).toBe('test-id');
            expect(block.type).toBe('code');
            expect(block.position).toBeDefined();
        });
    });

    describe('Cache Getters', () => {
        it('should return tags', () => {
            const tags = cache.getTags();
            expect(tags instanceof Map).toBe(true);
        });

        it('should return backlinks', () => {
            const backlinks = cache.getBacklinks();
            expect(backlinks instanceof Map).toBe(true);
        });

        it('should return links', () => {
            const links = cache.getLinks();
            expect(links instanceof Map).toBe(true);
        });

        it('should return resolved links', () => {
            const resolvedLinks = cache.getResolvedLinks();
            expect(resolvedLinks instanceof Map).toBe(true);
        });

        it('should return the block cache', () => {
            const blockCache = cache.getBlockCache();
            expect(blockCache instanceof Map).toBe(true);
        });
    });
}); 