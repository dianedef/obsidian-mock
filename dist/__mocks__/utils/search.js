import { vi } from 'vitest';
export const createSearchResult = (score, matches = []) => ({
    score,
    matches
});
export const searchContent = vi.fn((content, query) => {
    const matches = [];
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let score = 0;
    let lastIndex = 0;
    // Simple search for occurrences
    while (true) {
        const index = lowerContent.indexOf(lowerQuery, lastIndex);
        if (index === -1)
            break;
        matches.push([index, index + query.length]);
        score += 10; // Arbitrary score per match
        lastIndex = index + 1;
    }
    return createSearchResult(score, matches);
});
export const searchHeadings = vi.fn((headings, query) => {
    return headings.map(heading => {
        const result = searchContent(heading, query);
        // Score bonus for matches in titles
        result.score *= 2;
        return result;
    });
});
export const searchTags = vi.fn((tags, query) => {
    return tags.map(tag => {
        const result = searchContent(tag, query);
        // Score bonus for exact tag matches
        if (tag.toLowerCase() === query.toLowerCase()) {
            result.score *= 3;
        }
        return result;
    });
});
export const highlightMatches = vi.fn((text, matches) => {
    if (!matches.length)
        return text;
    let result = '';
    let lastIndex = 0;
    matches.forEach(([start, end]) => {
        // Add text before match
        result += text.slice(lastIndex, start);
        // Add highlighted match
        result += `===${text.slice(start, end)}===`;
        lastIndex = end;
    });
    // Add remaining text
    result += text.slice(lastIndex);
    return result;
});
