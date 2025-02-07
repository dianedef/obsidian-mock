import { vi } from 'vitest';
export class MockMetadataCache {
    constructor() {
        this.fileCache = new Map();
        this.resolvedLinks = new Map();
        this.unresolvedLinks = new Map();
        this.tags = new Map();
        this.links = new Map();
        this.backlinks = new Map();
        this.blockCache = new Map();
        this.on = vi.fn().mockImplementation((event, callback) => {
            return { id: 'event-ref' };
        });
        this.off = vi.fn();
        this.offref = vi.fn();
        this.tryTrigger = vi.fn();
        this.getFirstLinkpathDest = vi.fn().mockReturnValue(null);
        this.setCacheForFile = vi.fn().mockImplementation((file, cache) => {
            this.fileCache.set(file.path, {
                links: cache.links || [],
                embeds: cache.embeds || [],
                tags: cache.tags || [],
                headings: cache.headings || []
            });
        });
        this.deleteCacheForFile = vi.fn().mockImplementation((file) => {
            this.fileCache.delete(file.path);
        });
        this.getBacklinks = vi.fn().mockReturnValue(new Map());
        this.trigger = vi.fn().mockReturnThis();
    }
    getCache(path) {
        const cache = this.fileCache.get(path);
        if (!cache)
            return null;
        return {
            links: cache.links || [],
            embeds: cache.embeds || [],
            tags: cache.tags || [],
            headings: cache.headings || []
        };
    }
    getFileCache(file) {
        return this.getCache(file.path);
    }
    fileToLinktext(file, sourcePath, omitMdExtension) {
        const relativePath = this.getRelativePath(sourcePath, file.path);
        return omitMdExtension ? relativePath.replace(/\.md$/, '') : relativePath;
    }
    getRelativePath(from, to) {
        const fromParts = from.split('/');
        const toParts = to.split('/');
        fromParts.pop(); // Remove filename
        while (fromParts.length > 0 && toParts.length > 0 && fromParts[0] === toParts[0]) {
            fromParts.shift();
            toParts.shift();
        }
        const relativePath = '../'.repeat(fromParts.length) + toParts.join('/');
        return relativePath || './';
    }
    resolveLink(linktext, sourcePath) {
        return null;
    }
    getLinkSuggestions() {
        return Object.keys(this.links);
    }
    getTags() {
        return this.tags;
    }
    getBacklinksForFile(file) {
        return this.backlinks[file.path] || {};
    }
    getLinks() {
        return this.links;
    }
    getResolvedLinks() {
        return this.resolvedLinks;
    }
    getBlockCache() {
        return this.blockCache;
    }
    createFrontMatterCache(frontmatter) {
        return {
            position: {
                start: { line: 0, col: 0, offset: 0 },
                end: { line: 0, col: 0, offset: 0 }
            },
            ...frontmatter
        };
    }
    createTitleCache(content) {
        const match = content.match(/^#\s+(.+)$/m);
        if (!match)
            return null;
        return {
            heading: match[1],
            level: 1,
            position: { start: { line: 0, col: 0, offset: 0 }, end: { line: 0, col: match[0].length, offset: match[0].length } }
        };
    }
    createLinkCache(text, position) {
        return {
            link: text,
            original: text,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position, col: text.length, offset: text.length }
            }
        };
    }
    createTagCache(tag, position) {
        return {
            tag,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position, col: tag.length, offset: tag.length }
            }
        };
    }
    createEmbedCache(link, position) {
        return {
            link,
            original: link,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position, col: link.length, offset: link.length }
            }
        };
    }
    createListItemCache(text, position) {
        return {
            id: Math.random().toString(36).substr(2, 9),
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position, col: text.length, offset: text.length }
            },
            task: null,
            parent: position - 1
        };
    }
    createBlockCache(id, type, position) {
        return {
            id,
            type,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position, col: id.length, offset: id.length }
            }
        };
    }
    createSectionCache(position, type) {
        return {
            type,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position + 1, col: 0, offset: 0 }
            }
        };
    }
    createHeadingCache(heading, level, position) {
        return {
            heading,
            level,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position, col: heading.length, offset: heading.length }
            }
        };
    }
    getCachedFiles() {
        return Array.from(this.fileCache.keys());
    }
}
