import { vi } from 'vitest';
import type { ListItemCache, CacheItem } from 'obsidian';

export function createListItemCache(
    id: string | undefined,
    task: string | undefined,
    parent: number,
    position: { 
        start: { line: number; col: number; offset: number },
        end: { line: number; col: number; offset: number }
    }
): ListItemCache {
    return {
        id,
        task,
        parent,
        position
    };
}

export function iterateListItems(items: ListItemCache[], callback: (item: ListItemCache) => boolean | void): boolean {
    for (const item of items) {
        if (callback(item) === true) {
            return true;
        }
    }
    return false;
}

export const getListItemsInRange = vi.fn((items: ListItemCache[], startLine: number, endLine: number): ListItemCache[] => {
    return items.filter(item => 
        item.position.start.line >= startLine && 
        item.position.start.line <= endLine
    );
}); 