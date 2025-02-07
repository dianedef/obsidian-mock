import { vi } from 'vitest';
import type { 
    MetadataCache as IMetadataCache,
    CachedMetadata,
    TFile,
    LinkCache,
    ReferenceCache,
    HeadingCache,
    ListItemCache,
    EmbedCache,
    TagCache,
    FrontMatterCache,
    BlockCache,
    SectionCache
} from 'obsidian';

export class MockMetadataCache implements IMetadataCache {
    private fileCache: Map<string, CachedMetadata> = new Map();
    resolvedLinks: Map<string, Record<string, number>> = new Map();
    unresolvedLinks: Map<string, Record<string, number>> = new Map();
    private tags: Map<string, number> = new Map();
    private links: Map<string, LinkCache[]> = new Map();
    private backlinks: Map<string, Record<string, ReferenceCache[]>> = new Map();
    private blockCache: Map<string, BlockCache> = new Map();

    on = vi.fn().mockImplementation((event: string, callback: () => void) => {
        return { id: 'event-ref' };
    });

    off = vi.fn();
    offref = vi.fn();
    tryTrigger = vi.fn();

    getFirstLinkpathDest = vi.fn().mockReturnValue(null);

    setCacheForFile = vi.fn().mockImplementation((file: TFile, cache: CachedMetadata) => {
        this.fileCache.set(file.path, {
            links: cache.links || [],
            embeds: cache.embeds || [],
            tags: cache.tags || [],
            headings: cache.headings || []
        });
    });

    deleteCacheForFile = vi.fn().mockImplementation((file: TFile) => {
        this.fileCache.delete(file.path);
    });

    getCache(path: string): CachedMetadata | null {
        const cache = this.fileCache.get(path);
        if (!cache) return null;
        return {
            links: cache.links || [],
            embeds: cache.embeds || [],
            tags: cache.tags || [],
            headings: cache.headings || []
        };
    }

    getFileCache(file: TFile): CachedMetadata | null {
        return this.getCache(file.path);
    }

    fileToLinktext(file: TFile, sourcePath: string, omitMdExtension?: boolean): string {
        const relativePath = this.getRelativePath(sourcePath, file.path);
        return omitMdExtension ? relativePath.replace(/\.md$/, '') : relativePath;
    }

    private getRelativePath(from: string, to: string): string {
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

    resolveLink(linktext: string, sourcePath: string): TFile | null {
        return null;
    }

    getLinkSuggestions(): string[] {
        return Object.keys(this.links);
    }

    getTags(): Map<string, number> {
        return this.tags;
    }

    getBacklinksForFile(file: TFile): Record<string, ReferenceCache[]> {
        return this.backlinks[file.path] || {};
    }

    getBacklinks = vi.fn().mockReturnValue(new Map());

    getLinks(): Map<string, LinkCache[]> {
        return this.links;
    }

    getResolvedLinks(): Map<string, Record<string, number>> {
        return this.resolvedLinks;
    }

    getBlockCache(): Map<string, BlockCache> {
        return this.blockCache;
    }

    trigger = vi.fn().mockReturnThis();

    createFrontMatterCache(frontmatter: any): FrontMatterCache {
        return {
            position: {
                start: { line: 0, col: 0, offset: 0 },
                end: { line: 0, col: 0, offset: 0 }
            },
            ...frontmatter
        };
    }

    createTitleCache(content: string): HeadingCache | null {
        const match = content.match(/^#\s+(.+)$/m);
        if (!match) return null;

        return {
            heading: match[1],
            level: 1,
            position: { start: { line: 0, col: 0, offset: 0 }, end: { line: 0, col: match[0].length, offset: match[0].length } }
        };
    }

    createLinkCache(text: string, position: number): LinkCache {
        return {
            link: text,
            original: text,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position, col: text.length, offset: text.length }
            }
        };
    }

    createTagCache(tag: string, position: number): TagCache {
        return {
            tag,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position, col: tag.length, offset: tag.length }
            }
        };
    }

    createEmbedCache(link: string, position: number): EmbedCache {
        return {
            link,
            original: link,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position, col: link.length, offset: link.length }
            }
        };
    }

    createListItemCache(text: string, position: number): ListItemCache {
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

    createBlockCache(id: string, type: string, position: number): BlockCache {
        return {
            id,
            type,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position, col: id.length, offset: id.length }
            }
        };
    }

    createSectionCache(position: number, type: string): SectionCache {
        return {
            type,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position + 1, col: 0, offset: 0 }
            }
        };
    }

    createHeadingCache(heading: string, level: number, position: number): HeadingCache {
        return {
            heading,
            level,
            position: {
                start: { line: position, col: 0, offset: 0 },
                end: { line: position, col: heading.length, offset: heading.length }
            }
        };
    }

    getCachedFiles(): string[] {
        return Array.from(this.fileCache.keys());
    }
} 