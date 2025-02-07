import type { TagCache } from 'obsidian';
/**
 * Crée un cache de tag avec la position donnée
 * @public
 */
export declare function createTagCache(tag: string, position: {
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
}): TagCache;
