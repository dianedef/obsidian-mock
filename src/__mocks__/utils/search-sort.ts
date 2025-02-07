import { vi } from 'vitest';
import type { SearchResultContainer as BaseSearchResultContainer } from 'obsidian';

interface SearchResultContainer extends BaseSearchResultContainer {
    score?: number;
}

export function prepareQuery(query: string): string[] {
    return query.toLowerCase().split(/\s+/g);
}

export function fuzzySearch(query: string, text: string): boolean {
    const queryParts = prepareQuery(query);
    const textLower = text.toLowerCase();
    return queryParts.every(part => textLower.includes(part));
}

export function sortSearchResults(results: SearchResultContainer[]): SearchResultContainer[] {
    return results.sort((a, b) => {
        // Mock simple sort by score
        return (b.score || 0) - (a.score || 0);
    });
} 