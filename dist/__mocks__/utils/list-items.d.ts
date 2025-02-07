import type { ListItemCache } from 'obsidian';
export declare function createListItemCache(id: string | undefined, task: string | undefined, parent: number, position: {
    start: {
        line: number;
        col: number;
        offset: number;
    };
    end: {
        line: number;
        col: number;
        offset: number;
    };
}): ListItemCache;
export declare function iterateListItems(items: ListItemCache[], callback: (item: ListItemCache) => boolean | void): boolean;
export declare const getListItemsInRange: import("vitest/dist").Mock<[items: ListItemCache[], startLine: number, endLine: number], ListItemCache[]>;
