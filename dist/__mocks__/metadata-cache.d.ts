import type { CachedMetadata, Events, EventRef, TFile } from 'obsidian';
export declare class MockMetadataCache implements Events {
    resolvedLinks: Record<string, Record<string, number>>;
    unresolvedLinks: Record<string, Record<string, number>>;
    private fileCache;
    private eventHandlers;
    getFirstLinkpathDest: import("vitest/dist").Mock<[linkpath: string, sourcePath: string], TFile | null>;
    getFileCache(file: TFile): CachedMetadata | null;
    getCache(path: string): CachedMetadata | null;
    fileToLinktext: import("vitest/dist").Mock<[file: TFile, sourcePath: string, omitMdExtension?: boolean | undefined], string>;
    on(name: string, callback: Function, ctx?: any): EventRef;
    off(name: string, callback: Function): void;
    offref(ref: EventRef): void;
    trigger(name: string, ...args: any[]): void;
    tryTrigger(evt: string, args: any[]): void;
    setFileCache(file: TFile, cache: CachedMetadata): void;
    removeFileCache(file: TFile): void;
    setResolvedLinks(sourcePath: string, links: Record<string, number>): void;
    setUnresolvedLinks(sourcePath: string, links: Record<string, number>): void;
    triggerResolvedEvent(): void;
}
