import { vi } from 'vitest';
import type { MetadataCache as IMetadataCache, CachedMetadata, TFile } from 'obsidian';
import { Events } from './components/events';

export class MetadataCache extends Events implements IMetadataCache {
    private fileCache: Map<string, CachedMetadata> = new Map();
    resolvedLinks: Map<string, Record<string, number>> = new Map();
    unresolvedLinks: Map<string, Record<string, number>> = new Map();

    getFileCache = vi.fn().mockImplementation((file: TFile): CachedMetadata | null => {
        return this.fileCache.get(file.path) || null;
    });

    getCache = vi.fn().mockImplementation((path: string): CachedMetadata | null => {
        return this.fileCache.get(path) || null;
    });

    fileToLinktext = vi.fn().mockImplementation((file: TFile, sourcePath: string, omitMdExtension?: boolean): string => {
        return file.basename + (omitMdExtension ? '' : '.md');
    });

    getFirstLinkpathDest = vi.fn().mockReturnValue(null);

    setCacheForFile = vi.fn().mockImplementation((file: TFile, cache: CachedMetadata): void => {
        this.fileCache.set(file.path, cache);
    });

    deleteCacheForFile = vi.fn().mockImplementation((file: TFile): void => {
        this.fileCache.delete(file.path);
    });

    getCachedFiles = vi.fn().mockReturnValue([]);

    // Event management methods
    on(name: string, callback: Function, ctx?: any): EventRef {
        if (!this.eventHandlers.has(name)) {
            this.eventHandlers.set(name, []);
        }
        const handlers = this.eventHandlers.get(name)!;
        const handler = { callback, ctx };
        handlers.push(handler);

        return {
            id: name + '-' + handlers.length
        };
    }

    off(name: string, callback: Function): void {
        const handlers = this.eventHandlers.get(name);
        if (handlers) {
            const index = handlers.findIndex(h => h.callback === callback);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    offref(ref: EventRef): void {
        // No need to implement detach as EventRef doesn't have it
    }

    trigger(name: string, ...args: any[]): void {
        const handlers = this.eventHandlers.get(name);
        if (handlers) {
            for (const { callback, ctx } of handlers) {
                callback.apply(ctx, args);
            }
        }
    }

    tryTrigger(evt: string, args: any[]): void {
        const handlers = this.eventHandlers.get(evt);
        if (handlers) {
            for (const { callback, ctx } of handlers) {
                try {
                    callback.apply(ctx, args);
                } catch (e) {
                    console.error('Error triggering event', evt, e);
                }
            }
        }
    }

    // Utility methods for tests
    setFileCache(file: TFile, cache: CachedMetadata): void {
        this.fileCache.set(file.path, cache);
        this.trigger('changed', file, '', cache);
    }

    removeFileCache(file: TFile): void {
        const prevCache = this.fileCache.get(file.path);
        this.fileCache.delete(file.path);
        this.trigger('deleted', file, prevCache);
    }

    setResolvedLinks(sourcePath: string, links: Record<string, number>): void {
        this.resolvedLinks.set(sourcePath, links);
        this.trigger('resolve', { path: sourcePath });
    }

    setUnresolvedLinks(sourcePath: string, links: Record<string, number>): void {
        this.unresolvedLinks.set(sourcePath, links);
    }

    triggerResolvedEvent(): void {
        this.trigger('resolved');
    }
} 