import { vi } from 'vitest';
import type { SearchMatches, SearchResult } from 'obsidian';

export const renderMatches = vi.fn((
    el: HTMLElement | DocumentFragment,
    text: string,
    matches: SearchMatches | null,
    offset: number = 0
): void => {
    if (!matches || matches.length === 0) {
        el.textContent = text;
        return;
    }

    let lastIndex = 0;
    for (const [start, end] of matches) {
        // Ajoute le texte non surligné avant la correspondance
        if (start + offset > lastIndex) {
            el.appendText(text.slice(lastIndex, start + offset));
        }

        // Ajoute le texte surligné
        const mark = el.createEl('mark');
        mark.textContent = text.slice(start + offset, end + offset);

        lastIndex = end + offset;
    }

    // Ajoute le reste du texte après la dernière correspondance
    if (lastIndex < text.length) {
        el.appendText(text.slice(lastIndex));
    }
});

export const renderResults = vi.fn((
    el: HTMLElement,
    text: string,
    result: SearchResult,
    offset: number = 0
): void => {
    el.empty();
    if (result.score > 0) {
        renderMatches(el, text, result.matches, offset);
    } else {
        el.textContent = text;
    }
}); 