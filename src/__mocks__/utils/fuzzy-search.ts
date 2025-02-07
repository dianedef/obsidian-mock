import { vi } from 'vitest';
import type { SearchResult } from 'obsidian';

export const prepareFuzzySearch = vi.fn((query: string): ((text: string) => SearchResult | null) => {
    const queryLower = query.toLowerCase();

    return (text: string): SearchResult | null => {
        const textLower = text.toLowerCase();
        const matches: [number, number][] = [];
        let score = 0;
        let i = 0;
        let j = 0;

        // Simple fuzzy search algorithm for tests
        while (i < queryLower.length && j < textLower.length) {
            if (queryLower[i] === textLower[j]) {
                matches.push([j, j + 1]);
                i++;
                score += 1;
            }
            j++;
        }

        if (i === queryLower.length) {
            return {
                score,
                matches
            };
        }

        return null;
    };
});

export const prepareSimpleSearch = vi.fn((query: string): ((text: string) => SearchResult | null) => {
    const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);

    return (text: string): SearchResult | null => {
        const textLower = text.toLowerCase();
        const matches: [number, number][] = [];
        let score = 0;

        for (const term of terms) {
            const index = textLower.indexOf(term);
            if (index === -1) {
                return null;
            }
            matches.push([index, index + term.length]);
            score += term.length;
        }

        return {
            score,
            matches
        };
    };
}); 