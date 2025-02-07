import type { TagCache, CacheItem } from 'obsidian';

/**
 * Crée un cache de tag avec la position donnée
 * @public
 */
export function createTagCache(
    tag: string,
    position: { 
        start: { line: number; col: number; offset: number },
        end: { line: number; col: number; offset: number }
    }
): TagCache {
    return {
        tag,
        position
    };
} 