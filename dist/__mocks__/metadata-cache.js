import { vi } from 'vitest';
export class MockMetadataCache {
    constructor() {
        this.resolvedLinks = {};
        this.unresolvedLinks = {};
        this.fileCache = new Map();
        this.eventHandlers = new Map();
        this.getFirstLinkpathDest = vi.fn((linkpath, sourcePath) => {
            return null;
        });
        this.fileToLinktext = vi.fn((file, sourcePath, omitMdExtension = true) => {
            let linktext = file.basename;
            if (!omitMdExtension && file.extension === 'md') {
                linktext += '.md';
            }
            return linktext;
        });
    }
    getFileCache(file) {
        return this.fileCache.get(file.path) || null;
    }
    getCache(path) {
        return this.fileCache.get(path) || null;
    }
    // Event management methods
    on(name, callback, ctx) {
        if (!this.eventHandlers.has(name)) {
            this.eventHandlers.set(name, []);
        }
        const handlers = this.eventHandlers.get(name);
        const handler = { callback, ctx };
        handlers.push(handler);
        return {
            id: name + '-' + handlers.length
        };
    }
    off(name, callback) {
        const handlers = this.eventHandlers.get(name);
        if (handlers) {
            const index = handlers.findIndex(h => h.callback === callback);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    offref(ref) {
        // No need to implement detach as EventRef doesn't have it
    }
    trigger(name, ...args) {
        const handlers = this.eventHandlers.get(name);
        if (handlers) {
            for (const { callback, ctx } of handlers) {
                callback.apply(ctx, args);
            }
        }
    }
    tryTrigger(evt, args) {
        const handlers = this.eventHandlers.get(evt);
        if (handlers) {
            for (const { callback, ctx } of handlers) {
                try {
                    callback.apply(ctx, args);
                }
                catch (e) {
                    console.error('Error triggering event', evt, e);
                }
            }
        }
    }
    // Utility methods for tests
    setFileCache(file, cache) {
        this.fileCache.set(file.path, cache);
        this.trigger('changed', file, '', cache);
    }
    removeFileCache(file) {
        const prevCache = this.fileCache.get(file.path);
        this.fileCache.delete(file.path);
        this.trigger('deleted', file, prevCache);
    }
    setResolvedLinks(sourcePath, links) {
        this.resolvedLinks[sourcePath] = links;
        this.trigger('resolve', { path: sourcePath });
    }
    setUnresolvedLinks(sourcePath, links) {
        this.unresolvedLinks[sourcePath] = links;
    }
    triggerResolvedEvent() {
        this.trigger('resolved');
    }
}
