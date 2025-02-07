import { vi } from 'vitest';
import type { CachedMetadata, Events, EventRef, TFile } from 'obsidian';

export class MockMetadataCache implements Events {
    resolvedLinks: Record<string, Record<string, number>> = {};
    unresolvedLinks: Record<string, Record<string, number>> = {};
    private fileCache: Map<string, CachedMetadata> = new Map();
    private eventHandlers: Map<string, Array<{ callback: Function; ctx?: any }>> = new Map();

    getFirstLinkpathDest = vi.fn((linkpath: string, sourcePath: string): TFile | null => {
        return null;
    });

    getFileCache(file: TFile): CachedMetadata | null {
        return this.fileCache.get(file.path) || null;
    }

    getCache(path: string): CachedMetadata | null {
        return this.fileCache.get(path) || null;
    }

    fileToLinktext = vi.fn((file: TFile, sourcePath: string, omitMdExtension: boolean = true): string => {
        let linktext = file.basename;
        if (!omitMdExtension && file.extension === 'md') {
            linktext += '.md';
        }
        return linktext;
    });

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
        this.resolvedLinks[sourcePath] = links;
        this.trigger('resolve', { path: sourcePath });
    }

    setUnresolvedLinks(sourcePath: string, links: Record<string, number>): void {
        this.unresolvedLinks[sourcePath] = links;
    }

    triggerResolvedEvent(): void {
        this.trigger('resolved');
    }
} 